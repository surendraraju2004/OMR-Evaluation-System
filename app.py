from flask import Flask, request, jsonify
from flask_cors import CORS
from omr.omr_processing import evaluate_omr
import os
import uuid

app = Flask(__name__)
CORS(app)

# In-memory storage for demo (replace with DB in production)
results_store = []

@app.route('/api/evaluate', methods=['POST'])
def evaluate():
    files = request.files.getlist('files')
    version = request.form.get('examVersion')
    student_id = request.form.get('studentId')
    if not files or not version:
        return jsonify({'error': 'Missing files or exam version'}), 400
    response_results = []
    for file in files:
        # Save file temporarily
        filename = f"tmp_{uuid.uuid4().hex}_{file.filename}"
        filepath = os.path.join('tmp', filename)
        os.makedirs('tmp', exist_ok=True)
        file.save(filepath)
        # Evaluate OMR (implement logic in omr_processing.py)
        result = evaluate_omr(filepath, version, student_id)
        results_store.append(result)
        response_results.append(result)
        # Remove temp file
        os.remove(filepath)
    return jsonify({'results': response_results})

@app.route('/api/results', methods=['GET'])
def get_results():
    return jsonify({'results': results_store})

if __name__ == '__main__':
    app.run(debug=True)
