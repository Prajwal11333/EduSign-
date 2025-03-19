import cv2
import numpy as np
import mediapipe as mp
import pickle
from flask import Flask, request, jsonify
from io import BytesIO
from PIL import Image
from scipy.spatial import distance

app = Flask(__name__)

# Load the trained model
try:
    with open("asl_word_model.pkl", "rb") as file:
        model = pickle.load(file)
    print("✅ Model loaded successfully!")
except Exception as e:
    print("❌ Error loading model:", str(e))

# Initialize MediaPipe Hands
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=True, min_detection_confidence=0.5, min_tracking_confidence=0.5)

@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        print("❌ No image received!")
        return jsonify({"error": "No image received"}), 400

    try:
        # Read and convert image
        image_bytes = request.files["image"].read()
        image = Image.open(BytesIO(image_bytes))
        image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)

        # Convert to RGB for MediaPipe
        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        # Process image with MediaPipe
        result = hands.process(rgb_image)

        if result.multi_hand_landmarks:
            print("✅ Hand landmarks detected!")
            for hand_landmarks in result.multi_hand_landmarks:
                landmarks = []
                selected_distances = []

                # Extract x, y, z coordinates (63 features)
                for lm in hand_landmarks.landmark:
                    landmarks.append(lm.x)
                    landmarks.append(lm.y)
                    landmarks.append(lm.z)

                # Convert landmarks to numpy array
                landmark_points = np.array([(lm.x, lm.y, lm.z) for lm in hand_landmarks.landmark])

                # Select exactly 25 distances to get 88 features
                selected_pairs = [
                    (0, 5), (0, 17), (5, 9), (9, 13), (13, 17),
                    (0, 4), (0, 8), (0, 12), (0, 16), (0, 20),
                    (4, 8), (8, 12), (12, 16), (16, 20),
                    (4, 5), (8, 9), (12, 13), (16, 17),
                    (5, 17), (9, 13), (13, 17),
                    (5, 9), (9, 13), (13, 17),
                    (8, 16)
                ]

                for i, j in selected_pairs:
                    dist = distance.euclidean(landmark_points[i], landmark_points[j])
                    selected_distances.append(dist)

                # Combine into final feature vector
                final_features = landmarks + selected_distances  # 63 + 25 = 88

                # Convert to NumPy array for model prediction
                final_features_array = np.array(final_features).reshape(1, -1)
                print("🔍 Updated Model input shape:", final_features_array.shape)

                # 🔹 Make sure the prediction is a Python integer
                prediction = model.predict(final_features_array)
                predicted_label = int(prediction[0])  # Convert numpy.int64 to Python int

                print("🖐 Predicted sign:", predicted_label)

                return jsonify({"prediction": predicted_label})  # Ensure it's JSON serializable

        print("❌ No hand detected in the image!")
        return jsonify({"prediction": "No Sign Detected"})

    except Exception as e:
        print("❌ Error processing request:", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
