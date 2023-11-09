let currentQuestion = 0;
let amountRightAnsers = 0;

function init() {
    // render('./content/welcome.html');
    render('./content/quiz.html');
    // render('./content/result.html');
}

function render(content) {
    let container = document.getElementById('content');
    if (content) {
        container.setAttribute('w3-include-html', content);
    }
    includeHTML(content);
}

async function includeHTML(content) {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute('w3-include-html');
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
    checkContent(content)
}

function checkContent(content) {
    if (content == './content/quiz.html') {
        showQuestion();
    }
}

function showQuestion() {
    let container = document.getElementById('question');
    container.innerHTML = questions[currentQuestion]['question'];
    showAnwsers();
    setMarker();
    setAmountOfQuestion();
}

function showAnwsers() {
    for (let i = 1; i <= 4; i++) {
        document.getElementById(`answer_${i}`).innerHTML = questions[currentQuestion][`answer_${i}`];
    }
}

function setAmountOfQuestion() {
    document.getElementById('current_question_number').innerHTML = currentQuestion + 1;
    document.getElementById('amount_all_questions').innerHTML = questions.length;
}

function setMarker() {
    switch (questions[currentQuestion]['category']) {
        case 'physics': setMarkerStyle(1);
            break;
        case 'history': setMarkerStyle(2);;
            break;
        case 'geography': setMarkerStyle(3);;
            break;
        case 'literature': setMarkerStyle(4);;
            break;
    }
}

function setMarkerStyle(number) {
    for (let i = 1; i <= 4; i++) {
        if (i == number) {
            document.getElementById(`marker_${number}`).classList.add('bg-white');
        } else {
            document.getElementById(`marker_${i}`).classList.remove('bg-white');
        }
    }
}

function nextQuestion() {
    currentQuestion++;
    if (checkArrayIndex() == 1) {
        render('./content/result.html');
        currentQuestion = questions.length;
    } else {
        showNextQuestion();
    }
}

function showNextQuestion() {
    document.getElementById('next_button').disabled = true;
    unsetAnswerBoxColor();
    updateProgressBar();
    showQuestion();
}

function unsetAnswerBoxColor() {
    for(let i = 1; i <= 4; i++) {
        document.getElementById(`letter_${i}`).classList.remove('bg-success');
        document.getElementById(`body_answer_${i}`).classList.remove('bg-green');
        document.getElementById(`letter_${i}`).classList.remove('bg-danger');
        document.getElementById(`body_answer_${i}`).classList.remove('bg-red');
        document.getElementById(`letter_${i}`).classList.remove('color-white');
    }  
}


function checkArrayIndex() {
    if (currentQuestion < 0) {
        return -1;
    } else if (currentQuestion > questions.length) {
        return 1;
    }
}

function checkAnswer(id) {
    let currentRightAnswer = questions[currentQuestion]['right_answer'];
    if (id == currentRightAnswer) {
        setAnswerBoxColor('green', id);
        amountRightAnsers++;
    } else {
        setAnswerBoxColor('red', id);
        setAnswerBoxColor('green', currentRightAnswer);
    }
}

function setAnswerBoxColor(color, id) {
    switch (color) {
        case 'green':
            document.getElementById(`letter_${id}`).classList.add('bg-success');
            document.getElementById(`body_answer_${id}`).classList.add('bg-green');
            break;
        case 'red':
            document.getElementById(`letter_${id}`).classList.add('bg-danger');
            document.getElementById(`body_answer_${id}`).classList.add('bg-red');
            break;
    }
    document.getElementById(`letter_${id}`).classList.add('color-white');
    document.getElementById('next_button').disabled = false;
}

function updateProgressBar() {
    let percent = Math.round(((currentQuestion + 1) / questions.length) * 100);
    document.getElementById('progress_bar').style = `width: ${percent}%`;
}