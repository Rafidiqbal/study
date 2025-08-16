let subjects = JSON.parse(localStorage.getItem("subjects")) || {
    "Physics": Array.from({length: 10}, (_, i) => ({name: `Topic ${i+1}`, done: 0, total: 10})),
    "Chemistry": Array.from({length: 10}, (_, i) => ({name: `Topic ${i+1}`, done: 0, total: 10})),
    "Biology": Array.from({length: 10}, (_, i) => ({name: `Topic ${i+1}`, done: 0, total: 10})),
    "Higher Math": Array.from({length: 10}, (_, i) => ({name: `Topic ${i+1}`, done: 0, total: 10}))
};

let topicVisibility = {}; // Track collapsed/expanded state

function saveData() {
    localStorage.setItem("subjects", JSON.stringify(subjects));
}

function toggleTopics(subject) {
    topicVisibility[subject] = !topicVisibility[subject];
    updateUI();
}

function updateUI() {
    const container = document.getElementById("subjects");
    container.innerHTML = "";

    let allDone = 0, allTotal = 0;

    for (let subject in subjects) {
        let subDiv = document.createElement("div");
        subDiv.className = "subject";

        let totalDone = subjects[subject].reduce((a, t) => a + t.done, 0);
        let totalAll = subjects[subject].reduce((a, t) => a + t.total, 0);
        let subProgress = totalAll > 0 ? (totalDone / totalAll) * 100 : 0;

        allDone += totalDone;
        allTotal += totalAll;

        // Initialize visibility if not set
        if (topicVisibility[subject] === undefined) topicVisibility[subject] = true;

        subDiv.innerHTML = `<h2>${subject}   
            <button onclick="deleteSubject('${subject}')">❌</button>  
            <button onclick="addTopic('${subject}')">➕ Topic</button>
            <button onclick="toggleTopics('${subject}')">${topicVisibility[subject] ? '🔽' : '▶️'} Topics</button>
        </h2>
        <div class="progress-bar"><div class="progress" style="width:${subProgress}%"></div></div>`;

        if (topicVisibility[subject]) {
            subjects[subject].forEach((topic, idx) => {
                let topicDiv = document.createElement("div");
                topicDiv.className = "topic";
                let topicProgress = topic.total > 0 ? (topic.done / topic.total) * 100 : 0;
                topicDiv.innerHTML = `
                    ${topic.name} (${topic.done}/${topic.total})
                    <div class="progress-bar"><div class="progress" style="width:${topicProgress}%"></div></div>
                    <button onclick="editTopicProgress('${subject}', ${idx})">✏️ Progress</button>
                    <button onclick="renameTopic('${subject}', ${idx})">✏️ Name</button>
                    <button onclick="editTopicTotal('${subject}', ${idx})">✏️ Total</button>
                    <button onclick="deleteTopic('${subject}', ${idx})">❌</button>
                `;
                subDiv.appendChild(topicDiv);
            });
        }

        container.appendChild(subDiv);
    }

    let overallPercent = allTotal > 0 ? (allDone / allTotal) * 100 : 0;
    const circle = document.querySelector(".progress-circle");
    circle.style.background = `conic-gradient(#4caf50 0% ${overallPercent}%, #ddd ${overallPercent}% 100%)`;
    document.getElementById("overall-text").textContent = Math.round(overallPercent) + "%";

    saveData();
}

function addSubject() {
    let name = prompt("Enter new subject name:");
    if (name && !subjects[name]) {
        subjects[name] = [{name: "Topic 1", done: 0, total: 10}];
        updateUI();
    }
}

function deleteSubject(name) {
    if (confirm(`Delete subject "${name}"?`)) {
        delete subjects[name];
        delete topicVisibility[name];
        updateUI();
    }
}

function addTopic(subject) {
    let name = prompt("Enter topic name:");
    if (name) {
        subjects[subject].push({name, done: 0, total: 10});
        updateUI();
    }
}

function deleteTopic(subject, idx) {
    if (confirm("Delete this topic?")) {
        subjects[subject].splice(idx, 1);
        updateUI();
    }
}

function editTopicProgress(subject, idx) {
    let done = parseInt(prompt(`Enter completed lectures for "${subjects[subject][idx].name}":`, subjects[subject][idx].done));
    if (!isNaN(done) && done >= 0 && done <= subjects[subject][idx].total) {
        subjects[subject][idx].done = done;
        updateUI();
    }
}

function renameTopic(subject, idx) {
    let newName = prompt(`Enter new name for "${subjects[subject][idx].name}":`, subjects[subject][idx].name);
    if (newName && newName.trim() !== "") {
        subjects[subject][idx].name = newName.trim();
        updateUI();
    }
}

function editTopicTotal(subject, idx) {
    let newTotal = parseInt(prompt(`Enter total lectures for "${subjects[subject][idx].name}":`, subjects[subject][idx].total));
    if (!isNaN(newTotal) && newTotal > 0) {
        if (subjects[subject][idx].done > newTotal) subjects[subject][idx].done = newTotal;
        subjects[subject][idx].total = newTotal;
        updateUI();
    }
}

updateUI();
