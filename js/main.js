// ==========================
// MediBridge Dashboard Logic
// ==========================

// ---------- Utility ----------
function $(id) {
  return document.getElementById(id);
}
function openModal(id) {
  $(id).classList.remove("hidden");
  $(id).classList.add("flex");
}
function closeModal(id) {
  $(id).classList.add("hidden");
  $(id).classList.remove("flex");
}

// ---------- State ----------
let notifCount = 0;
let prescriptions = [];
let reports = [];
let syncOnline = false;

// ---------- Greeting ----------
(function () {
  const hour = new Date().getHours();
  let greetTxt = "Namaskaram";
  if (hour < 12) greetTxt = "Good Morning";
  else if (hour < 18) greetTxt = "Good Afternoon";
  else greetTxt = "Good Evening";
  $("greet").innerText = greetTxt + ",";
})();

// ---------- Sync Demo ----------
$("btnSync").addEventListener("click", () => {
  syncOnline = !syncOnline;
  $("syncBadge").innerText = syncOnline ? "Online" : "Offline";
  $("syncBadge").className =
    "mt-1 px-3 py-1 text-sm rounded-full " +
    (syncOnline
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800");
});

// ---------- Auto-Fill Demo ----------
$("btnAutoFill").addEventListener("click", () => {
  $("userNameTop").innerText = "Ravi Kumar";
  $("userIdTop").innerText = "MB-24-BH-12345";
  $("healthId").innerText = "MB-24-BH-12345";
  $("nextAppt").innerText = "15 Sep • District Hospital";
  $("healthScore").innerText = "88";
  $("rxCount").innerText = "3 active";
  prescriptions = ["Paracetamol", "Amoxicillin", "ORS Sachet"];
  renderPrescriptions();
  reports = [
    { title: "CBC Report", date: "2025-09-01" },
    { title: "X-Ray Chest", date: "2025-09-05" },
  ];
  renderReports();
  updateVaccination(3, 4);
  addNotification("Auto-fill demo completed ✅");
});

// ---------- Notifications ----------
function addNotification(msg) {
  notifCount++;
  $("notifCount").innerText = notifCount;
  const li = document.createElement("li");
  li.className = "bg-slate-50 p-3 rounded-lg border";
  li.innerText = msg;
  $("notifList").prepend(li);
}

$("newReminder").addEventListener("click", () => {
  addNotification("💉 Vaccination due tomorrow");
});

$("clearNotifs").addEventListener("click", () => {
  $("notifList").innerHTML = "";
  notifCount = 0;
  $("notifCount").innerText = 0;
});

// ---------- Prescriptions ----------
function renderPrescriptions() {
  $("rxList").innerText = prescriptions.join(", ");
}

$("addRx").addEventListener("click", () => {
  const med = prompt("Enter medicine name:");
  if (med) {
    prescriptions.push(med);
    renderPrescriptions();
    $("rxCount").innerText = prescriptions.length + " active";
    addNotification("Prescription added: " + med);
  }
});

// ---------- Reports ----------
function renderReports() {
  $("reportList").innerHTML = "";
  reports.forEach((r) => {
    const li = document.createElement("li");
    li.innerText = r.title + " (" + r.date + ")";
    $("reportList").appendChild(li);
  });
}

$("uploadBtnSmall").addEventListener("click", () => openModal("modalReport"));
$("reportForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const title = $("rTitle").value;
  const date = $("rDate").value;
  if (title && date) {
    reports.push({ title, date });
    renderReports();
    closeModal("modalReport");
    addNotification("Report uploaded: " + title);
  }
});

// ---------- Nearby Centres ----------
const nearby = [
  { name: "PHC Aluva", dist: "2.3 km", hrs: "24/7" },
  { name: "CHC Kalamassery", dist: "5.6 km", hrs: "9 AM–6 PM" },
  { name: "District Hospital", dist: "9.8 km", hrs: "24/7" },
];
function renderNearby() {
  $("nearbyList").innerHTML = "";
  nearby.forEach((c) => {
    const div = document.createElement("div");
    div.className =
      "p-3 rounded-lg border bg-slate-50 hover:bg-slate-100 transition";
    div.innerHTML = `<div class="font-semibold">${c.name}</div>
    <div class="text-xs text-slate-500">${c.dist} • ${c.hrs}</div>`;
    $("nearbyList").appendChild(div);
  });
}
renderNearby();
$("showMap").addEventListener("click", () => openModal("modalMap"));

// ---------- Vaccination Donut ----------
let vaccChart;
function updateVaccination(done, total) {
  if (vaccChart) vaccChart.destroy();
  vaccChart = new Chart($("vaccDonut"), {
    type: "doughnut",
    data: {
      labels: ["Done", "Pending"],
      datasets: [
        {
          data: [done, total - done],
          backgroundColor: ["#10b981", "#e5e7eb"],
          borderWidth: 0,
        },
      ],
    },
    options: { cutout: "70%" },
  });
  $("vacText").innerText = `${done} / ${total}`;
}
updateVaccination(1, 4);

// ---------- Analytics Charts ----------
new Chart($("trendLine"), {
  type: "line",
  data: {
    labels: ["Jun", "Jul", "Aug", "Sep"],
    datasets: [
      {
        label: "Fever Cases",
        data: [40, 32, 28, 20],
        borderColor: "#f87171",
        fill: false,
      },
      {
        label: "Vaccinations",
        data: [10, 25, 45, 60],
        borderColor: "#10b981",
        fill: false,
      },
    ],
  },
});
new Chart($("beforeAfter"), {
  type: "bar",
  data: {
    labels: ["Before AI", "After AI"],
    datasets: [
      {
        label: "Avg Response Time (hrs)",
        data: [6, 2],
        backgroundColor: ["#60a5fa", "#10b981"],
      },
    ],
  },
});

// ---------- KPIs ----------
$("kpiLives").innerText = "128";
$("kpiResp").innerText = "2h";

// ---------- Modals ----------
$("openProfile").addEventListener("click", () => openModal("modalProfile"));
$("openBook").addEventListener("click", () => openModal("modalBook"));
$("openReport").addEventListener("click", () => openModal("modalReport"));

// ---------- Profile Save ----------
$("profileForm").addEventListener("submit", (e) => {
  e.preventDefault();
  $("userNameTop").innerText = $("pfName").value || "User";
  $("healthId").innerText = $("pfId").value || "MB-XXXX-XXXX";
  closeModal("modalProfile");
  addNotification("Profile updated ✅");
});

// ---------- Language Switcher (demo) ----------
if ($("langSwitch")) {
  $("langSwitch").addEventListener("change", (e) => {
    addNotification("Language changed to " + e.target.value);
  });
}

// ---------- Voice Input (demo) ----------
if ($("voiceDemo")) {
  $("voiceDemo").addEventListener("click", () => {
    alert("🎤 Voice input demo (to be integrated)");
  });
}
