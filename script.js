const firebaseConfig = {
  apiKey: "AIzaSyCqfKoF0x5dkdsj83_lczbsm8tLQN3hzyQ",
  authDomain: "owners-login.firebaseapp.com",
  projectId: "owners-login",
  storageBucket: "owners-login.firebasestorage.app",
  messagingSenderId: "860477366916",
  appId: "1:860477366916:web:5a92f334a5b3a22c2e98d1",
  measurementId: "G-MP2N6KGMPT"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

function hideAllPages() {
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.remove("active");
  });
}

function showPage(pageId) {
  hideAllPages();

  const page = document.getElementById(pageId);

  if (page) {
    page.classList.add("active");
  }
}

function backHome() {
  showPage("home");
}

const properties = {
  "ルミナス・スターズ": {
    image: "https://i.imgur.com/yaVMzOT.jpg",
    address: "長野県 塩尻市広丘原新田 ２０６番地１３",
    owner: "小松 宗夫",

    contract: "フルパッケージ",
    office: "松本",
    staff: "鈴木 康治",
    inspectionDate: "2026/06/17",
    contractDate: "2025/02/20",
    completion: "2026/01/31",
    totalBuildings: "",
    totalUnits: "8戸",
    occupiedUnits: "7戸",
    moveOut: "1戸",
    futureOccupied: "7戸",
    futureRate: "87.5%"
  },

  小松住宅: {
    image: "https://i.imgur.com/pQG2UHV.jpg",
    address: "長野県 塩尻市広丘原新田 ２０６番地１",
    owner: "小松 宗夫",

    contract: "自主管理/一部不動産仲介",
    office: "-",
    staff: "小松　泰輝",
    salesstaff: "-",
    inspection: "-",
    contractDate: "-",
    completion: "1982/10/11",
    totalBuildings: "4棟",
    totalUnits: "4棟",
    occupiedUnits: "3棟",
    moveOut: "1棟",
    futureOccupied: "3棟",
    futureRate: "87.5%"
  }
};

function getBuildingAge(completionDate) {
  const built = new Date(completionDate);
  const today = new Date();

  let years = today.getFullYear() - built.getFullYear();
  let months = today.getMonth() - built.getMonth();

  if (today.getDate() < built.getDate()) {
    months--;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return `築${years}年${months}か月`;
}

function showDetail(name) {
  const item = properties[name];

  if (!item) return;

  hideAllPages();

  document.getElementById("detail").classList.add("active");

  document.getElementById("buildingName").textContent = name;
  document.getElementById("contract").textContent = item.contract;
  document.getElementById("office").textContent = item.office;
  document.getElementById("staff").textContent = item.staff;

  document.getElementById("inspectionDate").textContent =
    item.inspectionDate || "未登録";
  document.getElementById("contractDate").textContent = item.contractDate;
  document.getElementById("completion").textContent = item.completion;
  document.getElementById("age").textContent = getBuildingAge(item.completion);

  document.getElementById("totalBuildings").textContent = item.totalBuildings;
  document.getElementById("totalUnits").textContent = item.totalUnits;
  document.getElementById("occupiedUnits").textContent = item.occupiedUnits;
  document.getElementById("occupancyRate").textContent = item.occupancyRate;
  document.getElementById("moveOut").textContent = item.moveOut;
  document.getElementById("futureOccupied").textContent = item.futureOccupied;
  document.getElementById("futureRate").textContent = item.futureRate;

  const totalBuildingsRow = document.getElementById("totalBuildingsRow");

  if (name === "ルミナス・スターズ") {
    totalBuildingsRow.style.display = "none";
  } else {
    totalBuildingsRow.style.display = "";
  }
}

function login() {
  const email = document.getElementById("email").value;

  const password = document.getElementById("password").value;

  auth
    .signInWithEmailAndPassword(email, password)

    .then(() => {
      localStorage.setItem("loggedIn", "true");
      document.getElementById("loginPage").style.display = "none";
      document.getElementById("portal").style.display = "block";

      backHome();

      resetLogoutTimer();
    })

    .catch((error) => {
      alert("ログイン失敗\n" + error.message);
    });
}

function logout() {
  const result = confirm("ログアウトしてもよろしいですか？");

  if (!result) {
    return;
  }

  auth.signOut();

  document.getElementById("portal").style.display = "none";
  document.getElementById("loginPage").style.display = "block";
}

document.addEventListener("DOMContentLoaded", () => {
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  document.querySelectorAll(".auto-date").forEach((box) => {
    box.textContent = `${month}月${day}日現在の最新情報を表示しています。`;
  });

  createHomeCards();

  loadHistory();

  if (localStorage.getItem("loggedIn") === "true") {
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("portal").style.display = "block";

    backHome();
  } else {
    document.getElementById("loginPage").style.display = "block";
    document.getElementById("portal").style.display = "none";
  }
});

function togglePassword() {
  const password = document.getElementById("password");

  if (password.type === "password") {
    password.type = "text";
  } else {
    password.type = "password";
  }
}

firebase.auth().onAuthStateChanged((user) => {
  if (!user) return;

  console.log("UID:", user.uid);

  db.collection("kk-4365 User")
    .doc(user.uid)
    .get()
    .then((doc) => {
      console.log("Doc exists:", doc.exists);

      if (doc.exists) {
        console.log(doc.data());

        document.getElementById("ownerName").textContent =
          doc.data().Name + " 様";

        document.getElementById("ownerRole").textContent = doc.data().Role;
      }
    })
    .catch((error) => {
      console.error(error);
    });
});

firebase.auth().onAuthStateChanged((user) => {
  if (!user) return;

  console.log("UID:", user.uid);

  db.collection("tk-0814 User")
    .doc(user.uid)
    .get()
    .then((doc) => {
      console.log("Doc exists:", doc.exists);

      if (doc.exists) {
        console.log(doc.data());

        document.getElementById("ownerName").textContent =
          doc.data().Name + " 様";

        document.getElementById("ownerRole").textContent = doc.data().Role;
      }
    })
    .catch((error) => {
      console.error(error);
    });
});

function createHomeCards() {
  const container = document.getElementById("propertyContainer");

  container.innerHTML = "";

  Object.keys(properties).forEach((name) => {
    const item = properties[name];

    const card = document.createElement("div");

    card.className = "property-card";

    card.onclick = () => {};

    card.innerHTML = `

      <h3 class="card-title">${name}</h3>

      <div class="card-content">

        <div class="card-image">
          <img src="${item.image}">
        </div>

        <div class="card-info">
        
        <div class="card-button-area">
  <button class="recruit-btn"
    onclick="event.stopPropagation();
    ${
      name === "ルミナス・スターズ"
        ? "showPage('building-status')"
        : "showPage('komatsu-status')"
    }">
    入居募集状況
  </button>

 <button class="history-btn"
    onclick="event.stopPropagation();
    ${
      name === "ルミナス・スターズ"
        ? "showPage('building-history')"
        : "showPage('komatsu-history')"
    }">
    建物に関する写真
  </button>

</div>

        <table class="card-table">
        
<tr>
  <th>所在地</th>
  <td>${item.address}</td>
</tr>

<tr>
  <th>ご契約者様</th>
  <td>${item.owner}</td>
</tr>


  <tr>
    <th>契約形態</th>
    <td>${item.contract}</td>
  </tr>

  <tr>
    <th>管理営業所</th>
    <td>${item.office}</td>
  </tr>

  <tr>
    <th>担当者</th>
    <td>${item.staff}</td>
  </tr>

  <tr>
  
   <th>点検実施日</th>
<td>${item.inspectionDate || "-"}</td>
    
 </table>

</div> <!-- card-info を閉じる -->

</div> <!-- card-content を閉じる -->

<div class="summary-table">

  <div class="summary-head">契約日</div>
  <div class="summary-head">完工日</div>
  <div class="summary-head">築年数</div>

  <div class="summary-value">${item.contractDate}</div>
  <div class="summary-value">${item.completion}</div>
  <div class="summary-value">${getBuildingAge(item.completion)}</div>

  <div class="summary-head">
    ${name === "小松住宅" ? "総棟数" : "戸数"}
  </div>

  <div class="summary-head">
    ${name === "小松住宅" ? "入居棟数" : "入居戸数"}
  </div>

  <div class="summary-head">入居率</div>

  <div class="summary-value">
    ${item.totalBuildings || item.totalUnits}
  </div>

  <div class="summary-value">
    ${item.occupiedUnits}
  </div>

 <div class="summary-value">
 ${calcOccupancyRate(
   item.totalBuildings || item.totalUnits,
   item.occupiedUnits
 )}
</div>

</div>

`;

    container.appendChild(card);
  });
}

function loadNotices() {
  const list = document.getElementById("noticeList");

  list.innerHTML = "";

  db.collection("notices")
    .orderBy("createdAt", "desc")
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        const data = doc.data();

        list.innerHTML += `

<div class="notice-card"
onclick="openNotice('${doc.id}')">

${data.new ? '<span class="new-badge">NEW</span>' : ""}

<div class="notice-date">
${data.date}
</div>

<div class="notice-title">
${data.title}
</div>

</div>

`;
      });
    });
}

function openNotice(id) {
  db.collection("notices")
    .doc(id)
    .get()
    .then((doc) => {
      const data = doc.data();

      document.getElementById("noticeTitle").textContent = data.title;

      document.getElementById("noticeDate").textContent = data.date;

      document.getElementById("noticeContent").textContent = data.content;

      showPage("notice-detail");
    });
}

let unread = 3;

function loadNoticeCount(user) {
  db.collection("notices")
    .get()
    .then((snapshot) => {
      let unread = 0;

      const lastRead = user.lastReadNotice || "";

      snapshot.forEach((doc) => {
        const data = doc.data();

        if (data.date > lastRead) {
          unread++;
        }
      });

      document.getElementById("noticeCount").textContent = unread;
    });
}

function showPage(pageId) {
  document.getElementById("loadingOverlay").style.display = "flex";

  setTimeout(() => {
    hideAllPages();

    const page = document.getElementById(pageId);

    if (page) {
      page.classList.add("active");
    }

    document.getElementById("loadingOverlay").style.display = "none";
  }, 1000);
}

function calcOccupancyRate(total, occupied) {
  const totalNum = parseInt(total);
  const occupiedNum = parseInt(occupied);

  if (!totalNum) return "0%";

  return ((occupiedNum / totalNum) * 100).toFixed(1).replace(".0", "") + "%";
}

// ===== 建物完成までの歩み =====

// 画像一覧
const historyImages = [];

for (let i = 113; i <= 130; i++) {
  historyImages.push(`/images/history/IMG_0${i}.jpg`);
}

let historyIndex = 0;
let slideTimer = null;

// 初期表示
function loadHistory() {
  const main = document.getElementById("mainHistoryImage");
  const list = document.getElementById("historyList");

  if (!main || !list) return;

  historyIndex = 0;
  main.src = historyImages[0];

  list.innerHTML = "";

  historyImages.forEach((img, index) => {
    list.innerHTML += `
      <div class="history-thumb" onclick="showHistory(${index})">
        <div style="width:30px;text-align:center;">${index + 1}</div>
        <img src="${img}" alt="工事写真 ${index + 1}">
      </div>
    `;
  });
}

// 写真切替
function showHistory(index) {
  historyIndex = index;
  document.getElementById("mainHistoryImage").src = historyImages[index];
}

// 次へ
function nextHistory() {
  historyIndex++;

  if (historyIndex >= historyImages.length) {
    historyIndex = 0;
  }

  showHistory(historyIndex);
}

// 戻る
function prevHistory() {
  historyIndex--;

  if (historyIndex < 0) {
    historyIndex = historyImages.length - 1;
  }

  showHistory(historyIndex);
}

// 拡大
function openHistoryImage() {
  window.open(historyImages[historyIndex], "_blank");
}

// スライドショー
function toggleSlide() {
  if (slideTimer) {
    clearInterval(slideTimer);
    slideTimer = null;
    return;
  }

  slideTimer = setInterval(nextHistory, 3000);
}