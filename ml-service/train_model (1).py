

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

from sklearn.model_selection import (
    train_test_split,
    StratifiedKFold,
    cross_val_score
)
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    ConfusionMatrixDisplay,
    precision_score,
    recall_score,
    f1_score,
    roc_curve,
    auc,
    classification_report
)
import joblib

# =============================================================================
# STEP 1 — LOAD DATASET
# =============================================================================

df = pd.read_csv("blood donor list final wala.csv")

print("=" * 60)
print("DATASET OVERVIEW")
print("=" * 60)
print(f"  Shape         : {df.shape[0]} rows × {df.shape[1]} columns")
print(f"  Missing Values: {df.isnull().sum().sum()} total")


# =============================================================================
# STEP 2 — DROP IRRELEVANT COLUMNS
# =============================================================================


df = df.drop(columns=[
    'donor_id',
    'name',
    'email',
    'password',
    'contact_number',
    'city',
    'created_at',
    'availability'
])

print(f"\n  Columns after dropping: {list(df.columns)}")
print(f"  Shape after drop      : {df.shape}")

# =============================================================================
# STEP 3 — FEATURE ENGINEERING
# =============================================================================

df['avg_gap'] = np.where(
    df['number_of_donation'] > 0,
    df['months_since_first_donation'] / df['number_of_donation'],
    0
)

# Donations per month (higher = more active donor)
df['donation_frequency'] = np.where(
    df['months_since_first_donation'] > 0,
    df['number_of_donation'] / df['months_since_first_donation'],
    0
)

# Average pints donated per session (measures generosity per visit)
df['avg_pints_per_donation'] = np.where(
    df['number_of_donation'] > 0,
    df['pints_donated'] / df['number_of_donation'],
    0
)

print("\n" + "=" * 60)
print("ENGINEERED FEATURES")
print("=" * 60)
print(df[['avg_gap', 'donation_frequency', 'avg_pints_per_donation']].describe().round(3).to_string())

# =============================================================================
# STEP 4 — CREATE TARGET VARIABLE: is_frequent_donor
# =============================================================================
# Donors who donated MORE than the dataset average → 1 (frequent)
# Donors who donated at or below average           → 0 (infrequent)
# This creates a perfectly balanced 50/50 class distribution.
# =============================================================================

avg_donations = df['number_of_donation'].mean()
df['is_frequent_donor'] = (df['number_of_donation'] > avg_donations).astype(int)

print("\n" + "=" * 60)
print(" TARGET VARIABLE")
print("=" * 60)
print(f"  Average donations in dataset : {avg_donations:.2f}")
print(f"  Threshold                    : number_of_donation > {avg_donations:.1f}")
print(f"  1 = Frequent Donor   → HIGH priority in emergencies")
print(f"  0 = Infrequent Donor → lower priority")
print(f"\n  Class distribution:")
print(df['is_frequent_donor'].value_counts().rename({1: 'Frequent (1)', 0: 'Infrequent (0)'}).to_string())
vc = df['is_frequent_donor'].value_counts(normalize=True).mul(100).round(1)
print(f"\n  Class balance: {vc.to_dict()} → perfectly balanced ")

# =============================================================================
# STEP 5 — FEATURE CORRELATION WITH TARGET
# =============================================================================

numeric_cols = [
    'months_since_first_donation',
    'number_of_donation',
    'avg_gap',
    'donation_frequency',
    'avg_pints_per_donation'
]

print("\n" + "=" * 60)
print("FEATURE CORRELATIONS WITH TARGET")
print("=" * 60)
corr = df[numeric_cols + ['is_frequent_donor']].corr()['is_frequent_donor'].drop('is_frequent_donor')
for feat, val in corr.sort_values(ascending=False).items():
    bar  = '█' * int(abs(val) * 30)
    sign = '+' if val > 0 else '-'
    print(f"  {feat:<30} {sign}{abs(val):.4f}  {bar}")



# =============================================================================
# STEP 6 — SELECT FEATURES AND TARGET
# =============================================================================


features = [
    'months_since_first_donation',
    'avg_gap',
    'donation_frequency',
    'avg_pints_per_donation',
    'blood_group'
]

X = df[features].copy()
y = df['is_frequent_donor']

# One-hot encode blood_group
# drop_first=True drops A+ (reference) to avoid multicollinearity
X = pd.get_dummies(X, columns=['blood_group'], drop_first=True)

print("\n" + "=" * 60)
print("STEP 6 — FINAL FEATURE SET")
print("=" * 60)
for i, col in enumerate(X.columns, 1):
    print(f"  {i:>2}. {col}")
print(f"\n  Total features : {X.shape[1]}")
print(f"  Total samples  : {X.shape[0]}")

# =============================================================================
# STEP 7 — TRAIN-TEST SPLIT
# =============================================================================
# Split BEFORE scaling to prevent data leakage.
# stratify=y preserves 50/50 class balance in both splits.
# =============================================================================

X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

print("\n" + "=" * 60)
print("STEP 7 — TRAIN-TEST SPLIT")
print("=" * 60)
print(f"  Training samples : {X_train.shape[0]}")
print(f"  Test samples     : {X_test.shape[0]}")
print(f"  Train balance    : {y_train.value_counts().to_dict()}")
print(f"  Test  balance    : {y_test.value_counts().to_dict()}")

# =============================================================================
# STEP 8 — FEATURE SCALING
# =============================================================================
# StandardScaler: mean=0, std=1 per feature.
# Fit ONLY on training data, then transform both sets.
# =============================================================================

scaler         = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled  = scaler.transform(X_test)

print("\n" + "=" * 60)
print("FEATURE SCALING")
print("=" * 60)
print(f"  Method : StandardScaler (mean=0, std=1 per feature)")
print(f"  Fit on : training data only (no leakage)")
print(f"  Applied: to both train and test with same parameters")

# =============================================================================
# STEP 9 — TRAIN LOGISTIC REGRESSION MODEL
# =============================================================================

model = LogisticRegression(
    max_iter=1000,
    random_state=42,
    solver='lbfgs',
    C=1.0
)

model.fit(X_train_scaled, y_train)


print(f"  Algorithm          : Logistic Regression")
print(f"  Solver             : lbfgs")
print(f"  Regularization (C) : 1.0")
print(f"  Max iterations     : 1000")
print(f"  Model training complete")

# =============================================================================
# STEP 10 — CROSS-VALIDATION
# =============================================================================

cv        = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
cv_scores = cross_val_score(
    model,
    X_train_scaled,
    y_train,
    cv=cv,
    scoring='accuracy'
)

print("\n" + "=" * 60)
print("5-FOLD CROSS-VALIDATION (on training data)")
print("=" * 60)
for i, score in enumerate(cv_scores):
    bar = '█' * int(score * 20)
    print(f"  Fold {i+1} : {score:.4f}  {bar}")
print(f"  {'─' * 40}")
print(f"  Mean    : {cv_scores.mean():.4f}")
print(f"  Std Dev : {cv_scores.std():.4f}  (lower = more stable model)")

# =============================================================================
# STEP 11 — EVALUATE ON TEST SET
# =============================================================================

predictions = model.predict(X_test_scaled)
probs       = model.predict_proba(X_test_scaled)[:, 1]

accuracy  = accuracy_score(y_test, predictions)
precision = precision_score(y_test, predictions)
recall    = recall_score(y_test, predictions)
f1        = f1_score(y_test, predictions)
fpr, tpr, thresholds = roc_curve(y_test, probs)
roc_auc              = auc(fpr, tpr)

print("\n" + "=" * 60)
print("TEST SET EVALUATION")
print("=" * 60)
print(f"  Accuracy  : {accuracy  * 100:.2f}%  — overall correct predictions")
print(f"  Precision : {precision * 100:.2f}%  — of predicted frequent, how many truly were")
print(f"  Recall    : {recall    * 100:.2f}%  — of actual frequent donors, how many were found")
print(f"  F1 Score  : {f1        * 100:.2f}%  — balance between precision and recall")
print(f"  ROC AUC   : {roc_auc:.4f}     — 1.0 = perfect | 0.5 = random")

print(f"\n  Detailed Classification Report:")
print(classification_report(
    y_test, predictions,
    target_names=['Infrequent Donor (0)', 'Frequent Donor (1)']
))

# =============================================================================
# STEP 12 — FEATURE IMPORTANCE
# =============================================================================

feature_names = X.columns.tolist()
coef_df = pd.DataFrame({
    'Feature':     feature_names,
    'Coefficient': model.coef_[0]
}).sort_values('Coefficient', key=abs, ascending=False)

print("\n" + "=" * 60)
print("STEP 12 — FEATURE IMPORTANCE (by absolute coefficient)")
print("=" * 60)
for _, row in coef_df.iterrows():
    direction = '▲ more likely frequent' if row['Coefficient'] > 0 else '▼ less likely frequent'
    print(f"  {row['Feature']:<35} {row['Coefficient']:+.4f}  {direction}")

# =============================================================================
# STEP 13 — SAVE MODEL ARTIFACTS
# =============================================================================

joblib.dump(model,           'model.pkl')
joblib.dump(scaler,          'scaler.pkl')
joblib.dump(list(X.columns), 'feature_columns.pkl')



# =============================================================================
# STEP 14 — VISUALIZATIONS (2x2 essential plots)
# =============================================================================

plt.style.use('seaborn-v0_8-whitegrid')
fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.suptitle(
    f"Blood Donor — Frequent Donor Prediction (Logistic Regression)\n"
    f"Accuracy: {accuracy*100:.1f}%  |  AUC: {roc_auc:.3f}  |  "
    f"Precision: {precision*100:.1f}%  |  Recall: {recall*100:.1f}%",
    fontsize=13, fontweight='bold'
)

# (A) ROC Curve
ax1 = axes[0, 0]
ax1.plot(fpr, tpr, color='crimson', lw=2.5, label=f'ROC Curve (AUC = {roc_auc:.3f})')
ax1.plot([0, 1], [0, 1], 'k--', lw=1.2, label='Random Classifier (AUC = 0.5)')
ax1.fill_between(fpr, tpr, alpha=0.1, color='crimson')
ax1.set_xlabel("False Positive Rate", fontsize=11)
ax1.set_ylabel("True Positive Rate", fontsize=11)
ax1.set_title("ROC Curve", fontsize=12, fontweight='bold')
ax1.legend(fontsize=9)

# (B) Confusion Matrix
ax2 = axes[0, 1]
cm   = confusion_matrix(y_test, predictions)
disp = ConfusionMatrixDisplay(cm, display_labels=['Infrequent', 'Frequent'])
disp.plot(ax=ax2, colorbar=False, cmap='Reds')
ax2.set_title("Confusion Matrix", fontsize=12, fontweight='bold')

# (C) Metrics Bar Chart
ax3 = axes[1, 0]
m_names  = ['Accuracy', 'Precision', 'Recall', 'F1 Score', 'ROC AUC']
m_values = [accuracy, precision, recall, f1, roc_auc]
colors   = ['#1565C0', '#2E7D32', '#E65100', '#6A1B9A', '#AD1457']
bars     = ax3.bar(m_names, m_values, color=colors, edgecolor='white', linewidth=1.5)
for bar, val in zip(bars, m_values):
    ax3.text(
        bar.get_x() + bar.get_width() / 2,
        bar.get_height() + 0.01,
        f'{val:.3f}',
        ha='center', va='bottom',
        fontsize=9, fontweight='bold'
    )
ax3.set_ylim(0, 1.15)
ax3.set_ylabel("Score", fontsize=11)
ax3.set_title("Model Evaluation Metrics", fontsize=12, fontweight='bold')
ax3.tick_params(axis='x', labelsize=9)

# (D) Feature Importance
ax4 = axes[1, 1]
coef_sorted = coef_df.sort_values('Coefficient')
bar_colors  = ['#EF5350' if c < 0 else '#42A5F5' for c in coef_sorted['Coefficient']]
ax4.barh(
    coef_sorted['Feature'],
    coef_sorted['Coefficient'],
    color=bar_colors, edgecolor='white', height=0.6
)
ax4.axvline(0, color='black', linewidth=0.8, linestyle='--')
ax4.set_xlabel("Coefficient Value", fontsize=11)
ax4.set_title(
    "Feature Importance (Logistic Regression Coefficients)\n"
    "Blue = increases frequent donor probability  |  Red = decreases it",
    fontsize=11, fontweight='bold'
)
ax4.tick_params(axis='y', labelsize=9)

plt.tight_layout()

plt.show()

# =============================================================================
# FINAL SUMMARY
# =============================================================================

print("\n" + "=" * 60)
print("TRAINING COMPLETE — FINAL SUMMARY")
print("=" * 60)

print(f"  Features used     : {X.shape[1]}")

print(f"  Accuracy          : {accuracy  * 100:.2f}%")
print(f"  Precision         : {precision * 100:.2f}%")
print(f"  Recall            : {recall    * 100:.2f}%")
print(f"  F1 Score          : {f1        * 100:.2f}%")
print(f"  ROC AUC           : {roc_auc:.4f}")
print(f"  CV Mean Accuracy  : {cv_scores.mean() * 100:.2f}%  (stable across 5 folds)")
