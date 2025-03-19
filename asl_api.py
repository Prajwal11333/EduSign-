import pickle
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS

# Load the trained model
model_path = "asl_word_model.pkl"
with open(model_path, "rb") as file:
    model = pickle.load(file)

app = Flask(__name__)
CORS(app)

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json.get("landmarks")
        if not data:
            return jsonify({"error": "Invalid input"}), 400

        # Convert to numpy array and flatten
        processed_landmarks = np.array(data).flatten().reshape(1, -1)

        # Make prediction
        prediction = model.predict(processed_landmarks)

        return jsonify({"prediction": prediction.tolist()})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000, debug=True)
