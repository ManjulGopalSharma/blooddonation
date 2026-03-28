from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np
import os

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# =============================================================================
# LOAD ML ARTIFACTS
# =============================================================================
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
    print(f"\nERROR: {e}")
    print("Run train_model.py first.")
    exit(1)

# =============================================================================
# LOAD CSV — donor history lookup (FROM CODE 2)
# =============================================================================
CSV_FILENAME = 'donor_dataset.csv'
csv_path = os.path.join(BASE_DIR, CSV_FILENAME)

DONOR_HISTORY = {}
try:
    df_csv = pd.read_csv(csv_path)
    for _, row in df_csv.iterrows():
        email = str(row.get('email', '')).strip().lower()
        if email:
            DONOR_HISTORY[email] = {
                'months_since_first_donation': int(row.get('months_since_first_donation', 0)),
                'number_of_donation': int(row.get('number_of_donation', 0)),
                'pints_donated': int(row.get('pints_donated', 0)),
                'blood_group': str(row.get('blood_group', 'O+')).strip()
            }
    print("=" * 55)
    print(f"CSV loaded: {len(DONOR_HISTORY)} donor records")
    print("=" * 55)
except FileNotFoundError:
    print(f"WARNING: '{CSV_FILENAME}' not found")

# =============================================================================
# HELPER FUNCTIONS (COMMON)
# =============================================================================
def safe_int(value):
    try:
        return int(value)
    except:
        return 0
    
def build_features(donor):
    n = int(donor.get('number_of_donation'))
    m = int(donor.get('months_since_first_donation'))
    p = int(donor.get('pints_donated'))

    avg_gap            = round(m / n, 4) if n > 0 else 0
    donation_frequency = round(n / m, 4) if m > 0 else 0
    avg_pints          = round(p / n, 4) if n > 0 else 0

    row = {
        'months_since_first_donation': m,
        'avg_gap': avg_gap,
        'donation_frequency': donation_frequency,
        'avg_pints_per_donation': avg_pints,
        'blood_group': donor.get('blood_group', 'O+')
    }

    df = pd.DataFrame([row])
    df = pd.get_dummies(df, columns=['blood_group'])

    for col in feature_columns:
        if col not in df.columns:
            df[col] = 0

    df = df[feature_columns]
    df = df.fillna(0)
    return df


def get_priority(probability):
    if probability >= 0.75:
        return 'HIGH'
    elif probability >= 0.45:
        return 'MEDIUM'
    else:
        return 'LOW'


def score_donor(donor):
    features_df = build_features(donor)
    scaled      = scaler.transform(features_df)

    prediction  = int(model.predict(scaled)[0])
    probability = round(float(model.predict_proba(scaled)[0][1]), 4)

    return {
        'email': donor.get('email', ''),
        'username': donor.get('username') or donor.get('name', ''),
        'blood_group': donor.get('blood_group', ''),
        'probability': probability,
        'is_frequent_donor': prediction,
        'label': 'Frequent Donor' if prediction == 1 else 'Infrequent Donor',
        'priority': get_priority(probability),
        'found_in_csv': donor.get('found_in_csv', False)
    }

# =============================================================================
# ROUTE 1 — HEALTH CHECK (COMMON)
# =============================================================================
@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'running',
        'message': 'Daan ML Server is active',
        'model': 'Logistic Regression — Frequent Donor Predictor',
        'csv_donors': len(DONOR_HISTORY)
    }), 200


# =============================================================================
# ROUTE 2 — SINGLE DONOR 
# =============================================================================
@app.route('/predict', methods=['POST'])
def predict_single():
    try:
        donor = request.get_json()

        required = [
            'months_since_first_donation',
            'number_of_donation',
            'pints_donated',
            'blood_group'
        ]

        missing = [f for f in required if f not in donor]
        if missing:
            return jsonify({
                'error': 'Missing required fields',
                'missing': missing
            }), 400

        result = score_donor(donor)
        return jsonify(result), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# =============================================================================
# ROUTE 3 — BATCH (FULL DONOR OBJECTS)
# =============================================================================
@app.route('/predict-batch', methods=['POST'])
def predict_batch():
    try:
        body = request.get_json()

        if not body or 'donors' not in body:
            return jsonify({'error': 'donors array is required'}), 400

        donors = body.get('donors', [])
        results = []
        skipped = 0

        for donor in donors:
            try:
                results.append(score_donor(donor))
            except Exception:
                skipped += 1

        results.sort(key=lambda x: x['probability'], reverse=True)

        for i, r in enumerate(results):
            r['rank'] = i + 1

        return jsonify({
            'total_donors': len(results),
            'skipped': skipped,
            'ranked_donors': results
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# =============================================================================
# ROUTE 4 — BATCH (EMAIL BASED CSV LOOKUP) 
# =============================================================================
@app.route('/predict-batch-email', methods=['POST'])
def predict_batch_email():
    try:
        body = request.get_json()

        if not body or 'emails' not in body:
            return jsonify({'error': 'emails array is required'}), 400

        emails = body.get('emails', [])
        results = []
        skipped = 0

        for email in emails:
            try:
                email_key = str(email).strip().lower()

                history = DONOR_HISTORY.get(email_key, {
                    'months_since_first_donation': 0,
                    'number_of_donation': 0,
                    'pints_donated': 0,
                    'blood_group': 'O+'
                })

                donor_obj = {
                    'email': email_key,
                    'found_in_csv': email_key in DONOR_HISTORY,
                    **history
                }

                results.append(score_donor(donor_obj))

            except Exception:
                skipped += 1

        results.sort(key=lambda x: x['probability'], reverse=True)

        for i, r in enumerate(results):
            r['rank'] = i + 1

        return jsonify({
            'total_donors': len(results),
            'skipped': skipped,
            'ranked_donors': results
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# =============================================================================
# RUN SERVER
# =============================================================================
if __name__ == '__main__':
    print("\n" + "=" * 55)
    print("Daan ML Server — Combined Version")
    print("=" * 55)
    print("Routes:")
    print("GET  /health")
    print("POST /predict")
    print("POST /predict-batch")
    print("POST /predict-batch-email")
    print("=" * 55 + "\n")

    app.run(host='0.0.0.0', port=5001, debug=True)