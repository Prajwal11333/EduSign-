import pickle

# Load the trained model
with open("asl_word_model.pkl", "rb") as file:
    model = pickle.load(file)

print("✅ Model loaded successfully!")
print("🔢 Model type:", type(model).__name__)

# Check expected input features
if hasattr(model, "n_features_in_"):
    print("🔍 Expected Input Features:", model.n_features_in_)

if hasattr(model, "feature_names_in_"):
    print("📌 Feature names:", model.feature_names_in_)
