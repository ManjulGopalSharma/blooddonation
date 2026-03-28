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
import warnings
from sklearn.exceptions import ConvergenceWarning
warnings.filterwarnings("ignore", category=ConvergenceWarning)
from sklearn.metrics import log_loss


# =============================================================================
# STEP 1 — LOAD DATASET
# =============================================================================

df = pd.read_csv("donor_dataset.csv")

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

# Average months between donations (lower = more frequent donor)
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
print("TARGET VARIABLE")
print("=" * 60)
print(f"  Average donations in dataset : {avg_donations:.2f}")
print(f"  Threshold                    : number_of_donation > {avg_donations:.1f}")
print(f"  1 = Frequent Donor   → HIGH priority in emergencies")
print(f"  0 = Infrequent Donor → lower priority")
print(f"\n  Class distribution:")
print(df['is_frequent_donor'].value_counts().rename({1: 'Frequent (1)', 0: 'Infrequent (0)'}).to_string())
vc = df['is_frequent_donor'].value_counts(normalize=True).mul(100).round(1)
print(f"\n  Class balance: {vc.to_dict()} → perfectly balanced")

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
    if pd.isna(val):
        print(f"  {feat:<30} NaN  (zero variance — skipped)")
        continue
    bar  =  int(abs(val) * 30)
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
# drop_first=True drops one category (reference) to avoid multicollinearity
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

print("\n" + "=" * 60)
print("STEP 9 — MODEL TRAINING")
print("=" * 60)
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
    bar =  int(score * 20)
    print(f"  Fold {i+1} : {score:.4f}  {bar}")
print(f"  {'─' * 40}")
print(f"  Mean    : {cv_scores.mean():.4f}")
print(f"  Std Dev : {cv_scores.std():.4f}  (lower = more stable model)")


# =============================================================================
# EXTRA — TRACK TRAINING & VALIDATION LOSS
# =============================================================================

print("\n" + "=" * 60)
print("TRAINING & VALIDATION LOSS TRACKING")
print("=" * 60)

# Reinitialize model with warm_start to simulate epochs
loss_model = LogisticRegression(
    max_iter=1,          # one iteration at a time
    warm_start=True,     # continue training
    solver='lbfgs',
    random_state=42
)

train_losses = []
val_losses   = []

epochs = 50

for i in range(epochs):
    loss_model.fit(X_train_scaled, y_train)

    # Predict probabilities
    train_probs = loss_model.predict_proba(X_train_scaled)
    val_probs   = loss_model.predict_proba(X_test_scaled)

    # Compute log loss
    train_loss = log_loss(y_train, train_probs)
    val_loss   = log_loss(y_test, val_probs)

    train_losses.append(train_loss)
    val_losses.append(val_loss)

    print(f"Epoch {i+1:02d} → Train Loss: {train_loss:.4f}, Val Loss: {val_loss:.4f}")

# =============================================================================
# STEP 11 — EVALUATE ON TEST SET
# =============================================================================

predictions = model.predict(X_test_scaled)
probs       = model.predict_proba(X_test_scaled)[:, 1]

comparison_df = pd.DataFrame({
    'Actual': y_test.values,
    'Predicted': predictions
})

# Convert to labels (optional but better for readability)
comparison_df['Actual_Label'] = comparison_df['Actual'].map({
    0: 'Infrequent',
    1: 'Frequent'
})

comparison_df['Predicted_Label'] = comparison_df['Predicted'].map({
    0: 'Infrequent',
    1: 'Frequent'
})

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
print(comparison_df.head(20))

print(f"\n  Detailed Classification Report:")
print(classification_report(
    y_test, predictions,
    target_names=['Infrequent Donor (0)', 'Frequent Donor (1)']
))

# =============================================================================
# CORRECT VS INCORRECT PREDICTIONS
# =============================================================================

comparison_df['Result'] = np.where(
    comparison_df['Actual'] == comparison_df['Predicted'],
    'Correct',
    'Incorrect'
)

print("\nPrediction Summary:")
print(comparison_df['Result'].value_counts())


# =============================================================================
# MISCLASSIFIED CASES
# =============================================================================

misclassified = comparison_df[
    comparison_df['Actual'] != comparison_df['Predicted']
]

print("\nMisclassified Samples:")
print(misclassified.head(10))
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
# These 3 files are loaded by app.py at server startup.
# Must be in the same folder as app.py.
# =============================================================================

joblib.dump(model,           'model.pkl')
joblib.dump(scaler,          'scaler.pkl')
joblib.dump(list(X.columns), 'feature_columns.pkl')

print("\n" + "=" * 60)
print("STEP 13 — ARTIFACTS SAVED")
print("=" * 60)
print("  model.pkl           → trained Logistic Regression model")
print("  scaler.pkl          → fitted StandardScaler")


# =============================================================================
# STEP 14 — VISUALIZATIONS (SEPARATE FIGURES)
# =============================================================================

plt.style.use('seaborn-v0_8-whitegrid')

# -----------------------------
# (A) ROC Curve
# -----------------------------
plt.figure(figsize=(7, 5))
plt.plot(fpr, tpr, color='crimson', lw=2.5, label=f'ROC Curve (AUC = {roc_auc:.3f})')
plt.plot([0, 1], [0, 1], 'k--', lw=1.2, label='Random Classifier (AUC = 0.5)')
plt.fill_between(fpr, tpr, alpha=0.1, color='crimson')
plt.xlabel("False Positive Rate", fontsize=11)
plt.ylabel("True Positive Rate", fontsize=11)
plt.title("ROC Curve", fontsize=12, fontweight='bold')
plt.legend(fontsize=9)
plt.tight_layout()
plt.show()


# -----------------------------
# (B) Confusion Matrix
# -----------------------------
cm = confusion_matrix(y_test, predictions)
disp = ConfusionMatrixDisplay(cm, display_labels=['Infrequent', 'Frequent'])
disp.plot(colorbar=False, cmap='Reds')  # no plt.figure()
plt.title("Confusion Matrix", fontsize=12, fontweight='bold')
plt.tight_layout()
plt.show()


# -----------------------------
# (C) Metrics Bar Chart
# -----------------------------
plt.figure(figsize=(7, 5))
m_names  = ['Accuracy', 'Precision', 'Recall', 'F1 Score', 'ROC AUC']
m_values = [accuracy, precision, recall, f1, roc_auc]
colors   = ['#1565C0', '#2E7D32', '#E65100', '#6A1B9A', '#AD1457']

bars = plt.bar(m_names, m_values, color=colors, edgecolor='white', linewidth=1.5)

for bar, val in zip(bars, m_values):
    plt.text(
        bar.get_x() + bar.get_width() / 2,
        bar.get_height() + 0.01,
        f'{val:.3f}',
        ha='center', va='bottom',
        fontsize=9, fontweight='bold'
    )

plt.ylim(0, 1.15)
plt.ylabel("Score", fontsize=11)
plt.title("Model Evaluation Metrics", fontsize=12, fontweight='bold')
plt.tight_layout()
plt.show()


# -----------------------------
# (D) Feature Importance
# -----------------------------
plt.figure(figsize=(8, 6))

coef_sorted = coef_df.sort_values('Coefficient')
bar_colors  = ['#EF5350' if c < 0 else '#42A5F5' for c in coef_sorted['Coefficient']]

plt.barh(
    coef_sorted['Feature'],
    coef_sorted['Coefficient'],
    color=bar_colors,
    edgecolor='white',
    height=0.6
)

plt.axvline(0, color='black', linewidth=0.8, linestyle='--')
plt.xlabel("Coefficient Value", fontsize=11)
plt.title(
    "Feature Importance (Logistic Regression Coefficients)\n"
    "Blue = increases frequent donor probability  |  Red = decreases it",
    fontsize=11, fontweight='bold'
)

plt.tight_layout()
plt.show()
# -----------------------------
# (E) Training vs Validation Loss
# -----------------------------
plt.figure(figsize=(7, 5))

plt.plot(range(1, epochs + 1), train_losses, label='Training Loss', linewidth=2)
plt.plot(range(1, epochs + 1), val_losses, label='Validation Loss', linewidth=2)

plt.xlabel("Epochs", fontsize=11)
plt.ylabel("Log Loss", fontsize=11)
plt.title("Training vs Validation Loss", fontsize=12, fontweight='bold')
plt.legend()
plt.grid(True)

plt.tight_layout()
plt.show()

# =============================================================================
# CLEAN ACTUAL VS PREDICTED (SUBSET VIEW)
# =============================================================================

actual_vals = y_test.values
pred_vals   = predictions

# n = 80   # show only first 80 samples

# plt.figure(figsize=(8,5))

# plt.scatter(range(n), actual_vals[:n], label='Actual', marker='o')
# plt.scatter(range(n), pred_vals[:n], label='Predicted', marker='x')

# plt.xlabel("Sample Index")
# plt.ylabel("Class (0 or 1)")
# plt.title("Actual vs Predicted Donors (Scatter View)")

# plt.legend()
# plt.grid(True)
# plt.show()

# =============================================================================
# BAR CHART — ACTUAL VS PREDICTED DISTRIBUTION
# =============================================================================

actual_counts = comparison_df['Actual_Label'].value_counts()
pred_counts   = comparison_df['Predicted_Label'].value_counts()

labels = ['Infrequent', 'Frequent']

x = np.arange(len(labels))
width = 0.35

plt.figure(figsize=(7,5))

plt.bar(x - width/2, actual_counts[labels], width, label='Actual')
plt.bar(x + width/2, pred_counts[labels], width, label='Predicted')

plt.xticks(x, labels)
plt.ylabel("Number of Donors")
plt.title("Actual vs Predicted Donor Classification")
plt.legend()

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
