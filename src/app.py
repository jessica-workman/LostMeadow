
from flask import Flask, request, jsonify
from flask import render_template
import requests
import json
import base64
import numpy as np
from PIL import Image
from io import BytesIO

app = Flask(__name__)

TF_SERVING_URL = 'http://localhost:8501/v1/models/your_model:predict'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/privacy')
def privacy():
    return render_template('privacy.html')

@app.route('/blog')
def blog():
    return render_template('blog.html')

@app.route('/api/classify', methods=['POST'])
def classify_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    image_file = request.files['image']
    image = Image.open(image_file.stream).convert('RGB')
    image = image.resize((224, 224))
    image_array = np.array(image) / 255.0
    image_array = image_array.reshape(1, 224, 224, 3)

    payload = {
        'instances': image_array.tolist()
    }

    response = requests.post(TF_SERVING_URL, json=payload)
    if response.status_code != 200:
        return jsonify({'error': 'Error during classification'}), 500

    predictions = json.loads(response.text)['predictions']
    return jsonify(predictions[0])


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)




