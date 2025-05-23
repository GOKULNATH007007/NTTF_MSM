let complaintData = [];
let editMode = false;
let complaintCount = 0;
let currentComplaintIndex = null;

function saveData() {
    const status01 = document.getElementById("status01").value.trim();
    const status02 = document.getElementById("status02").value.trim();
    const status03 = document.getElementById("status03").value.trim();
    const remarks04 = document.getElementById("remarks04").value.trim();
    const status05 = document.getElementById("status05").value.trim();

    if (!status01 || !status02 || !status03 || !remarks04 || !status05) {
        alert("All fields must be filled before saving the complaint.");
        return;
    }

    const newComplaint = {
        status01, status02, status03, remarks04, status05,
        finished: false,
        okayed: false,
        sent: false
    };

    complaintData.push(newComplaint);
    localStorage.setItem("maintenanceData", JSON.stringify(complaintData));
    lockInputs();

    document.getElementById("sendBtn").disabled = false;
}

function sendData() {
    const index = complaintData.length - 1;
    if (index >= 0) {
        complaintData[index].sent = true;
        localStorage.setItem("maintenanceData", JSON.stringify(complaintData));
        createComplaintButton(index);
    }

    document.getElementById("sendBtn").disabled = true;
    clearForm();
    document.getElementById("complaintButtons").scrollIntoView({ behavior: 'smooth' });
}

function clearForm() {
    document.querySelectorAll("input, textarea").forEach(el => {
        el.value = "";
        el.removeAttribute("readonly");
        el.style.backgroundColor = "white";
    });

    document.getElementById("sendBtn").disabled = true;
}

function lockInputs() {
    document.querySelectorAll("input, textarea").forEach(el => {
        el.setAttribute("readonly", true);
        el.style.backgroundColor = "#eee";
    });
}

function unlockInputs() {
    document.querySelectorAll("input, textarea").forEach(el => {
        el.removeAttribute("readonly");
        el.style.backgroundColor = "white";
    });
}

function loadData() {
    document.getElementById("complaintButtons").innerHTML = "";
    const saved = localStorage.getItem("maintenanceData");
    if (saved) {
        complaintData = JSON.parse(saved);
        complaintCount = complaintData.length;
        complaintData.forEach((data, index) => {
            if (!data.okayed && data.sent) {
                createComplaintButton(index);
            }
        });
    }
}

function createComplaintButton(index) {
    const data = complaintData[index];
    if (document.getElementById(`complaintWrapper${index}`)) return;

    const wrapper = document.createElement("div");
    wrapper.id = `complaintWrapper${index}`;
    wrapper.style.marginBottom = "10px";

    const btn = document.createElement("button");
    btn.className = "complaintBtn redBtn";
    btn.id = `complaintBtn${index + 1}`;
    btn.textContent = `Complaint ${index + 1}`;
    btn.onclick = () => showComplaint(index);

    wrapper.appendChild(btn);
    document.getElementById("complaintButtons").appendChild(wrapper);
}

function showComplaint(index) {
    const data = complaintData[index];
    document.getElementById("status01").value = data.status01;
    document.getElementById("status02").value = data.status02;
    document.getElementById("status03").value = data.status03;
    document.getElementById("remarks04").value = data.remarks04;
    document.getElementById("status05").value = data.status05;
    currentComplaintIndex = index;

    const existingOkayBtn = document.getElementById("okayBtn");
    if (existingOkayBtn) existingOkayBtn.remove();

    if (data.okayed) {
        lockInputs();
        document.getElementById("controlBtns").style.display = "none";
        document.getElementById("editSection").style.display = "none";
    } else if (data.finished && !data.okayed) {
        lockInputs();
        document.getElementById("controlBtns").style.display = "none";
        document.getElementById("editSection").style.display = "block";
        document.getElementById("editBtn").style.display = "none";
        document.getElementById("saveEditBtn").style.display = "none";

        const okayBtn = document.createElement("button");
        okayBtn.id = "okayBtn";
        okayBtn.textContent = "OKAY";
        okayBtn.style.backgroundColor = "green";
        okayBtn.style.color = "white";
        okayBtn.style.marginLeft = "10px";
        okayBtn.onclick = () => {
            markOkayed(index);
            okayBtn.remove();
        };
        document.getElementById("editSection").appendChild(okayBtn);
    } else {
        lockInputs();
        document.getElementById("controlBtns").style.display = "none";
        document.getElementById("editSection").style.display = "block";
        document.getElementById("editBtn").style.display = "inline-block";
        document.getElementById("saveEditBtn").style.display = "inline-block";
    }
}

function markOkayed(index) {
    complaintData[index].okayed = true;
    localStorage.setItem("maintenanceData", JSON.stringify(complaintData));
    const wrapper = document.getElementById(`complaintWrapper${index}`);
    if (wrapper) wrapper.remove();
    closeComplaint();
}

function closeComplaint() {
    clearForm();
    currentComplaintIndex = null;
    document.getElementById("editSection").style.display = "none";
    document.getElementById("controlBtns").style.display = "flex";
}

function enableEdit() {
    unlockInputs();
    editMode = true;
}

function saveEditedData() {
    if (editMode && currentComplaintIndex !== null) {
        const edited = {
            ...complaintData[currentComplaintIndex],
            status01: document.getElementById("status01").value,
            status02: document.getElementById("status02").value,
            status03: document.getElementById("status03").value,
            remarks04: document.getElementById("remarks04").value,
            status05: document.getElementById("status05").value
        };
        complaintData[currentComplaintIndex] = edited;
        localStorage.setItem("maintenanceData", JSON.stringify(complaintData));
        editMode = false;
        lockInputs();
    }
}

window.onload = function () {
    loadData();
    document.querySelectorAll("input, textarea").forEach(el => {
        el.addEventListener("input", function () {
            document.getElementById("sendBtn").disabled = true;
        });
    });
};
