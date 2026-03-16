

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np
import os

app = Flask(__name__)
CORS(app)   # allow cross-origin requests from Express backend



BASE_DIR = os.path.dirname(os.path.abspath(__file__))

try:
    model           = joblib.load(os.path.join(BASE_DIR, 'model.pkl'))
    scaler          = joblib.load(os.path.join(BASE_DIR, 'scaler.pkl'))
    feature_columns = joblib.load(os.path.join(BASE_DIR, 'feature_columns.pkl'))
    print("=" * 55)
    print("   model.pkl           loaded successfully")
    print("   scaler.pkl          loaded successfully")
    print("   feature_columns.pkl loaded successfully")
    print(f"  Features: {feature_columns}")
    print("=" * 55)
except FileNotFoundError as e:
    print(f"\n  ERROR: {e}")
    print("  Run train_model.py first to generate model artifacts.")
    exit(1)


# =============================================================================
# HELPER — Build feature row from raw donor MongoDB document
# =============================================================================

def build_features(donor):
    """
    Takes a raw donor dict from MongoDB and engineers the features
    that the trained model expects.

    Required fields from the MongoDB donor document:
        months_since_first_donation : int  (how many months since first donation)
        number_of_donation          : int  (total number of donations)
        pints_donated               : int  (total pints donated)
        blood_group                 : str  ('A+', 'B-', 'O+', 'AB-', etc.)

    Optional fields (used for identity only, not prediction):
        email    : str
        username : str  (or 'name')

    Returns a single-row DataFrame ready for scaler.transform()
    """
    n = int(donor.get('number_of_donation', 0))
    m = int(donor.get('months_since_first_donation', 0))
    p = int(donor.get('pints_donated', 0))

    # Derive behavioral features (same logic as train_model.py)
    avg_gap            = round(m / n, 4) if n > 0 else 0
    donation_frequency = round(n / m, 4) if m > 0 else 0
    avg_pints          = round(p / n, 4) if n > 0 else 0

    row = {
        'months_since_first_donation': m,
        'avg_gap':                     avg_gap,
        'donation_frequency':          donation_frequency,
        'avg_pints_per_donation':      avg_pints,
        'blood_group':                 donor.get('blood_group', 'A+')
    }

    df = pd.DataFrame([row])

    # One-hot encode blood_group to match training format
    df = pd.get_dummies(df, columns=['blood_group'])

    # Add any missing blood group columns with 0
    # (e.g. if this donor is A+, all other blood group columns = 0)
    for col in feature_columns:
        if col not in df.columns:
            df[col] = 0

    # Enforce exact column order from training
    df = df[feature_columns]
    return df


def get_priority(probability):
    """Convert probability to human-readable priority label."""
    if probability >= 0.75:
        return 'HIGH'
    elif probability >= 0.45:
        return 'MEDIUM'
    else:
        return 'LOW'


def score_donor(donor):
    """
    Score a single donor dict through the ML model.
    Returns result dict with email, username, probability, priority.
    """
    features_df = build_features(donor)
    scaled      = scaler.transform(features_df)
    prediction  = int(model.predict(scaled)[0])
    probability = round(float(model.predict_proba(scaled)[0][1]), 4)

    return {
        'email':             donor.get('email', ''),
        'username':          donor.get('username') or donor.get('name', ''),
        'blood_group':       donor.get('blood_group', ''),
        'probability':       probability,
        'is_frequent_donor': prediction,
        'label':             'Frequent Donor' if prediction == 1 else 'Infrequent Donor',
        'priority':          get_priority(probability)
    }


# =============================================================================
# ROUTE 1 — Health Check
# GET /health
# =============================================================================
# Express calls this on startup to confirm the ML server is running.
#
# Response:
# {
#     "status":  "running",
#     "message": "Daan ML Server is active"
# }
# =============================================================================

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status':  'running',
        'message': 'Daan ML Server is active',
        'model':   'Logistic Regression — Frequent Donor Predictor',
        'note':    'availability column not used — behavior-based prediction only'
    }), 200


# =============================================================================
# ROUTE 2 — Predict Single Donor
# POST /predict
# =============================================================================
# Score one specific donor by their email and donation history.
# Used when checking a single donor's reliability score on their profile page.
#


@app.route('/predict', methods=['POST'])
def predict_single():
    try:
        donor = request.get_json()

        if not donor:
            return jsonify({'error': 'Request body is empty'}), 400

        # Validate required fields
        required = [
            'months_since_first_donation',
            'number_of_donation',
            'pints_donated',
            'blood_group'
        ]
        missing = [f for f in required if f not in donor]
        if missing:
            return jsonify({
                'error':   'Missing required fields',
                'missing': missing,
                'hint':    'These fields must come from the donor MongoDB document'
            }), 400

        result = score_donor(donor)
        return jsonify(result), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# =============================================================================
# ROUTE 3 — Predict Batch (PRIMARY EMERGENCY ROUTE)
# POST /predict-batch


@app.route('/predict-batch', methods=['POST'])
def predict_batch():
    try:
        body = request.get_json()

        if not body:
            return jsonify({'error': 'Request body is empty'}), 400

        if 'donors' not in body:
            return jsonify({
                'error': 'donors array is required',
                'hint':  'Send { hospital_city, blood_group_needed, donors: [...] }'
            }), 400

        donors             = body.get('donors', [])
        hospital_city      = body.get('hospital_city', '')
        blood_group_needed = body.get('blood_group_needed', '')

        print(f"\n Emergency batch request")
        print(f"   City         : {hospital_city}")
        print(f"   Blood needed : {blood_group_needed}")
        print(f"   Donors sent  : {len(donors)}")

        # Handle empty donor list
        if len(donors) == 0:
            return jsonify({
                'hospital_city':      hospital_city,
                'blood_group_needed': blood_group_needed,
                'total_donors':       0,
                'high_priority':      0,
                'medium_priority':    0,
                'low_priority':       0,
                'ranked_donors':      [],
                'message':            f'No donors found in {hospital_city}'
            }), 200

        # Score every donor
        # If one donor has bad/missing data, skip them without crashing the batch
        results = []
        skipped = 0

        for donor in donors:
            try:
                result = score_donor(donor)
                results.append(result)
            except Exception as donor_error:
                skipped += 1
                print(f"   ⚠ Skipped {donor.get('email', 'unknown')}: {donor_error}")
                results.append({
                    'email':             donor.get('email', ''),
                    'username':          donor.get('username') or donor.get('name', ''),
                    'blood_group':       donor.get('blood_group', ''),
                    'probability':       0.0,
                    'is_frequent_donor': 0,
                    'label':             'Infrequent Donor',
                    'priority':          'LOW',
                    'error':             str(donor_error)
                })

        # Sort by probability — highest first
        results.sort(key=lambda x: x['probability'], reverse=True)

        # Add rank numbers after sorting
        for i, r in enumerate(results):
            r['rank'] = i + 1

        # Count priority tiers
        high_count   = sum(1 for r in results if r['priority'] == 'HIGH')
        medium_count = sum(1 for r in results if r['priority'] == 'MEDIUM')
        low_count    = sum(1 for r in results if r['priority'] == 'LOW')

        print(f"   Scored : {len(results)} donors")
        print(f"   HIGH   : {high_count}")
        print(f"   MEDIUM : {medium_count}")
        print(f"   LOW    : {low_count}")
        if skipped > 0:
            print(f"   Skipped: {skipped} (bad/missing data)")

        return jsonify({
            'hospital_city':      hospital_city,
            'blood_group_needed': blood_group_needed,
            'total_donors':       len(results),
            'high_priority':      high_count,
            'medium_priority':    medium_count,
            'low_priority':       low_count,
            'skipped':            skipped,
            'ranked_donors':      results
        }), 200

    except Exception as e:
        print(f"    Server error: {e}")
        return jsonify({'error': str(e)}), 500


# =============================================================================
# RUN SERVER
# =============================================================================

if __name__ == '__main__':
    print("\n" + "=" * 55)
    print("   Daan ML Server — Blood Donor Predictor")
    print("=" * 55)
    print("  URL    : http://localhost:5001")
    print("  Routes :")
    print("    GET  /health         → health check")
    print("    POST /predict        → score single donor")
    print("    POST /predict-batch  → score + rank batch (MAIN)")
    print("=" * 55 + "\n")
    app.run(host='0.0.0.0', port=5001, debug=True)
