// main.js

// Global variables
let processedResults = [];
let totalProcessed = 0;

// Answer keys for different versions
const answerKeys = {
    A: {
        subject1: ['A', 'B', 'C', 'D', 'A', 'B', 'C', 'D', 'A', 'B', 'C', 'D', 'A', 'B', 'C', 'D', 'A', 'B', 'C', 'D'],
        subject2: ['B', 'A', 'D', 'C', 'B', 'A', 'D', 'C', 'B', 'A', 'D', 'C', 'B', 'A', 'D', 'C', 'B', 'A', 'D', 'C'],
        subject3: ['C', 'D', 'A', 'B', 'C', 'D', 'A', 'B', 'C', 'D', 'A', 'B', 'C', 'D', 'A', 'B', 'C', 'D', 'A', 'B'],
        subject4: ['D', 'C', 'B', 'A', 'D', 'C', 'B', 'A', 'D', 'C', 'B', 'A', 'D', 'C', 'B', 'A', 'D', 'C', 'B', 'A'],
        subject5: ['A', 'C', 'B', 'D', 'A', 'C', 'B', 'D', 'A', 'C', 'B', 'D', 'A', 'C', 'B', 'D', 'A', 'C', 'B', 'D']
    },
    B: {
        subject1: ['B', 'A', 'D', 'C', 'B', 'A', 'D', 'C', 'B', 'A', 'D', 'C', 'B', 'A', 'D', 'C', 'B', 'A', 'D', 'C'],
        subject2: ['C', 'D', 'A', 'B', 'C', 'D', 'A', 'B', 'C', 'D', 'A', 'B', 'C', 'D', 'A', 'B', 'C', 'D', 'A', 'B'],
        subject3: ['D', 'C', 'B', 'A', 'D', 'C', 'B', 'A', 'D', 'C', 'B', 'A', 'D', 'C', 'B', 'A', 'D', 'C', 'B', 'A'],
        subject4: ['A', 'B', 'C', 'D', 'A', 'B', 'C', 'D', 'A', 'B', 'C', 'D', 'A', 'B', 'C', 'D', 'A', 'B', 'C', 'D'],
        subject5: ['B', 'D', 'A', 'C', 'B', 'D', 'A', 'C', 'B', 'D', 'A', 'C', 'B', 'D', 'A', 'C', 'B', 'D', 'A', 'C']
    }
};

document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('fileInput');
    const uploadArea = document.getElementById('uploadArea');
    const processBtn = document.getElementById('processBtn');

    fileInput.addEventListener('change', handleFileSelect);
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
    uploadArea.addEventListener('click', () => fileInput.click());
});

function handleFileSelect(event) {
    const files = Array.from(event.target.files);
    updateUploadUI(files);
}

function handleDragOver(event) {
    event.preventDefault();
    document.getElementById('uploadArea').classList.add('dragover');
}

function handleDragLeave(event) {
    event.preventDefault();
    document.getElementById('uploadArea').classList.remove('dragover');
}

function handleDrop(event) {
    event.preventDefault();
    document.getElementById('uploadArea').classList.remove('dragover');
    const files = Array.from(event.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    if (files.length > 0) {
        document.getElementById('fileInput').files = event.dataTransfer.files;
        updateUploadUI(files);
    }
}

function updateUploadUI(files) {
    const uploadArea = document.getElementById('uploadArea');
    const processBtn = document.getElementById('processBtn');
    if (files.length > 0) {
        uploadArea.innerHTML = `
            <div class="upload-icon">✅</div>
            <div class="upload-text">
                ${files.length} file(s) selected<br>
                Ready to process
            </div>
        `;
        processBtn.disabled = false;
        showMessage('success', `${files.length} OMR sheet(s) ready for processing`);
    }
}

function showMessage(type, message) {
    const errorMsg = document.getElementById('errorMessage');
    const successMsg = document.getElementById('successMessage');
    errorMsg.style.display = 'none';
    successMsg.style.display = 'none';
    if (type === 'error') {
        errorMsg.textContent = message;
        errorMsg.style.display = 'block';
    } else {
        successMsg.textContent = message;
        successMsg.style.display = 'block';
    }
    setTimeout(() => {
        errorMsg.style.display = 'none';
        successMsg.style.display = 'none';
    }, 5000);
}

async function processOMR() {
    const files = document.getElementById('fileInput').files;
    const examVersion = document.getElementById('examVersion').value;
    const studentId = document.getElementById('studentId').value;
    const processingStatus = document.getElementById('processingStatus');
    if (files.length === 0) {
        showMessage('error', 'Please select OMR sheet images first');
        return;
    }
    processingStatus.classList.add('active');
    try {
        const results = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            processingStatus.textContent = `🔄 Processing sheet ${i + 1} of ${files.length}...`;
            await new Promise(resolve => setTimeout(resolve, 1000));
            const result = await simulateOMRProcessing(file, examVersion, studentId);
            results.push(result);
        }
        processedResults = processedResults.concat(results);
        totalProcessed += results.length;
        displayResults(results[results.length - 1]);
        updateDashboard();
        showMessage('success', `Successfully processed ${files.length} OMR sheet(s)`);
    } catch (error) {
        showMessage('error', 'Error processing OMR sheets: ' + error.message);
    } finally {
        processingStatus.classList.remove('active');
    }
}

async function simulateOMRProcessing(file, examVersion, studentId) {
    const answers = generateRandomAnswers();
    const answerKey = answerKeys[examVersion] || answerKeys.A;
    const scores = calculateScores(answers, answerKey);
    return {
        studentId: studentId || `STU${Math.floor(Math.random() * 10000)}`,
        examVersion: examVersion,
        fileName: file.name,
        timestamp: new Date().toISOString(),
        scores: scores,
        totalScore: scores.total,
        percentage: ((scores.total / 100) * 100).toFixed(1),
        answers: answers,
        processingTime: Math.random() * 2 + 0.5
    };
}

function generateRandomAnswers() {
    const subjects = ['subject1', 'subject2', 'subject3', 'subject4', 'subject5'];
    const answers = {};
    const choices = ['A', 'B', 'C', 'D'];
    subjects.forEach(subject => {
        answers[subject] = Array.from({length: 20}, () => Math.random() > 0.1 ? choices[Math.floor(Math.random() * 4)] : null);
    });
    return answers;
}

function calculateScores(answers, answerKey) {
    const scores = {
        subject1: 0, subject2: 0, subject3: 0, subject4: 0, subject5: 0, total: 0
    };
    Object.keys(answerKey).forEach(subject => {
        for (let i = 0; i < 20; i++) {
            if (answers[subject][i] === answerKey[subject][i]) {
                scores[subject]++;
            }
        }
    });
    scores.total = scores.subject1 + scores.subject2 + scores.subject3 + scores.subject4 + scores.subject5;
    return scores;
}

function displayResults(result) {
    const resultsDiv = document.getElementById('currentResults');
    resultsDiv.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h3>Student: ${result.studentId}</h3>
            <p>Version: ${result.examVersion} | Score: ${result.totalScore}/100 (${result.percentage}%)</p>
        </div>
        <div class="results-grid">
            <div class="score-card">
                <h3>Data Analytics</h3>
                <div class="score">${result.scores.subject1}/20</div>
            </div>
            <div class="score-card">
                <h3>AI/ML</h3>
                <div class="score">${result.scores.subject2}/20</div>
            </div>
            <div class="score-card">
                <h3>Statistics</h3>
                <div class="score">${result.scores.subject3}/20</div>
            </div>
            <div class="score-card">
                <h3>Python</h3>
                <div class="score">${result.scores.subject4}/20</div>
            </div>
            <div class="score-card">
                <h3>Gen AI</h3>
                <div class="score">${result.scores.subject5}/20</div>
            </div>
            <div class="score-card" style="background: linear-gradient(135deg, #fd79a8, #e84393);">
                <h3>Total Score</h3>
                <div class="score">${result.totalScore}/100</div>
            </div>
        </div>
    `;
}

function updateDashboard() {
    const totalSheets = document.getElementById('totalSheets');
    const averageScore = document.getElementById('averageScore');
    const timeSaved = document.getElementById('timeSaved');
    totalSheets.textContent = totalProcessed;
    if (processedResults.length > 0) {
        const avgScore = processedResults.reduce((sum, result) => sum + parseFloat(result.percentage), 0) / processedResults.length;
        averageScore.textContent = avgScore.toFixed(1) + '%';
    }
    const timeSavedHours = (totalProcessed * 2.5) / 60;
    timeSaved.textContent = timeSavedHours.toFixed(1) + ' hrs';
}

function exportResults(format) {
    if (processedResults.length === 0) {
        showMessage('error', 'No results to export. Process some OMR sheets first.');
        return;
    }
    if (format === 'csv') {
        exportCSV();
    } else if (format === 'excel') {
        exportExcel();
    } else if (format === 'pdf') {
        generatePDFReport();
    }
}

function exportCSV() {
    const headers = ['Student ID', 'Exam Version', 'Data Analytics', 'AI/ML', 'Statistics', 'Python', 'Gen AI', 'Total Score', 'Percentage', 'Timestamp'];
    const rows = processedResults.map(result => [
        result.studentId,
        result.examVersion,
        result.scores.subject1,
        result.scores.subject2,
        result.scores.subject3,
        result.scores.subject4,
        result.scores.subject5,
        result.totalScore,
        result.percentage + '%',
        new Date(result.timestamp).toLocaleString()
    ]);
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    downloadFile(csvContent, 'omr_results.csv', 'text/csv');
    showMessage('success', 'CSV file downloaded successfully!');
}


function exportExcel() {
    if (!processedResults.length) {
        showMessage('error', 'No results to export. Process some OMR sheets first.');
        return;
    }
    // Prepare worksheet data
    const wsData = [
        ['Student ID', 'Exam Version', 'Data Analytics', 'AI/ML', 'Statistics', 'Python', 'Gen AI', 'Total Score', 'Percentage', 'Timestamp']
    ];
    processedResults.forEach(result => {
        wsData.push([
            result.studentId,
            result.examVersion,
            result.scores.subject1,
            result.scores.subject2,
            result.scores.subject3,
            result.scores.subject4,
            result.scores.subject5,
            result.totalScore,
            result.percentage + '%',
            new Date(result.timestamp).toLocaleString()
        ]);
    });
    // Create worksheet and workbook
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Results');
    // Export to file
    XLSX.writeFile(wb, 'omr_results.xlsx');
    showMessage('success', 'Excel file downloaded successfully!');
}

function generatePDFReport() {
    if (!processedResults.length) {
        showMessage('error', 'No results to export. Process some OMR sheets first.');
        return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('OMR Evaluation Results', 10, 10);
    let y = 20;
    processedResults.forEach((result, idx) => {
        doc.setFontSize(11);
        doc.text(`Student: ${result.studentId} | Version: ${result.examVersion} | Score: ${result.totalScore}/100 (${result.percentage}%)`, 10, y);
        y += 7;
        doc.text(`Data Analytics: ${result.scores.subject1}/20, AI/ML: ${result.scores.subject2}/20, Statistics: ${result.scores.subject3}/20, Python: ${result.scores.subject4}/20, Gen AI: ${result.scores.subject5}/20`, 10, y);
        y += 10;
        if (y > 270) { doc.addPage(); y = 20; }
    });
    doc.save('omr_results.pdf');
    showMessage('success', 'PDF report downloaded successfully!');
}

function downloadFile(content, fileName, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}
