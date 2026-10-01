import Papa from "papaparse";
import "./index.css";
import { renderChart } from "./graph.js";

const API_URLS = {
    water: "/api/water",
    salinity: "/api/salinity",
    do1: "/api/do1",
    do3: "/api/do3", //追加
};

//グラフの表示/非表示
let isChartVisible = false;
// Vite の環境変数から API URL を取得

// API からデータを取得して表示するためのコード
const app = document.querySelector<HTMLDivElement>("#app");

//センサ種切り替え
function setActiveTab(activeButton: HTMLElement) {
    document.querySelectorAll(".tab").forEach((button) => {
        button.classList.remove("active");
    });

    activeButton.classList.add("active");
}

async function fetchData(apiUrl: string): Promise<string | null> {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.text();
    } catch (error) {
        console.error("データの取得に失敗しました:", error);
        return null;
    }
}

function parseData(data: string) {
    const parsed = Papa.parse(data, {
        header: false,
        skipEmptyLines: true,
    });

    return parsed.data;
}

const renderTable = (data: string, sensorType: string): string => {

    if (sensorType === "water") {
        return renderWaterTable(data);
    }

    if (sensorType === "salinity") {
        return renderSalinityTable(data);
    }

    if (sensorType === "do1") {
        return renderDO1Table(data);
    }
    //追加
    if (sensorType === "do3") {
        return renderDO3Table(data);
    }

    return "";
};

function renderWaterTable(data: string): string {

    const rows = parseData(data);

    let tableHtml = `
        <table border="1">
            <thead>
                <tr>
                    <th>センサID</th>
                    <th>日時</th>
                    <th>バッテリ電圧</th>
                    <th>外気温</th>
                    <th>水温</th>
                </tr>
            </thead>
            <tbody>
    `;

    rows.reverse().forEach((row: any) => {

        const utcDate = new Date(row[1]);
        const jst = utcDate.toLocaleString("ja-JP", {
            timeZone: "Asia/Tokyo"
        });

        tableHtml += `
            <tr>
                <td>${row[0]}</td>
                <td>${jst}</td>
                <td>${row[2]} V</td>
                <td>${row[3]} ℃</td>
                <td>${row[4]} ℃</td>
            </tr>
        `;
    });

    tableHtml += `
            </tbody>
        </table>
    `;

    return tableHtml;
}

function renderSalinityTable(data: string): string {
    const rows = parseData(data);

    let tableHtml = `
        <table border="1">
            <thead>
                <tr>
                    <th>センサID</th>
                    <th>日時</th>
                    <th>バッテリ電圧</th>
                    <th>外気温</th>
                    <th>水温</th>
                    <th>電気伝導度</th>
                    <th>塩分</th>
                </tr>
            </thead>
            <tbody>
    `;

    rows.reverse().forEach((row: any) => {

        const utcDate = new Date(row[1]);
        const jst = utcDate.toLocaleString("ja-JP", {
            timeZone: "Asia/Tokyo"
        });

        tableHtml += `
            <tr>
                <td>${row[0]}</td>
                <td>${jst}</td>
                <td>${row[2]} V</td>
                <td>${row[3]} ℃</td>
                <td>${row[4]} ℃</td>
                <td>${row[5]} mS/cm</td>
                <td>${row[6]} psu</td>
            </tr>
        `;
    });

    tableHtml += `
            </tbody>
        </table>
    `;

    return tableHtml;
}

function renderDO1Table(data: string): string {
    const rows = parseData(data);

    let tableHtml = `
        <table border="1">
            <thead>
                <tr>
                    <th>センサID</th>
                    <th>日時</th>
                    <th>バッテリ電圧</th>
                    <th>外気温</th>
                    <th>水温</th>
                    <th>DO(%)</th>
                    <th>DO(mg/L)</th>
                </tr>
            </thead>
            <tbody>
    `;

    rows.reverse().forEach((row: any) => {

        const utcDate = new Date(row[1]);
        const jst = utcDate.toLocaleString("ja-JP", {
            timeZone: "Asia/Tokyo"
        });

        tableHtml += `
            <tr>
                <td>${row[0]}</td>
                <td>${jst}</td>
                <td>${row[2]} V</td>
                <td>${row[3]} ℃</td>
                <td>${row[4]} ℃</td>
                <td>${row[5]} %</td>
                <td>${row[6]} mg/L</td>
            </tr>
        `;
    });

    tableHtml += `
            </tbody>
        </table>
    `;

    return tableHtml;
}
//追加
function renderDO3Table(data: string): string {
    const rows = parseData(data);

    let tableHtml = `
        <table border="1">
            <thead>
                <tr>
                    <th>センサID</th>
                    <th>日時</th>
                    <th>バッテリ電圧</th>
                    <th>外気温</th>
                    <th>水温</th>
                    <th>DO(%)</th>
                    <th>DO(mg/L)</th>
                </tr>
            </thead>
            <tbody>
    `;

    rows.reverse().forEach((row: any) => {

        const utcDate = new Date(row[1]);
        const jst = utcDate.toLocaleString("ja-JP", {
            timeZone: "Asia/Tokyo"
        });

        tableHtml += `
            <tr>
                <td>${row[0]}</td>
                <td>${jst}</td>
                <td>${row[2]} V</td>
                <td>${row[3]} ℃</td>
                <td>${row[4]} ℃</td>
                <td>${row[5]} %</td>
                <td>${row[6]} mg/L</td>
            </tr>
        `;
    });

    tableHtml += `
            </tbody>
        </table>
    `;

    return tableHtml;
}

if (app) {
    //button追加
    app.innerHTML = `
    <div class="title-row">
        <h2>センサデータ（分析用）</h2>
        <a href="https://kitsunezaki.vercel.app/data" target="_blank" rel="noopener noreferrer">
            狐崎みるはこちら
        </a>
    </div>

    <div id="tab-container">
        <button id="water-tab" class="tab">水温</button>
        <button id="salinity-tab" class="tab active">塩分</button>
        <button id="do1-tab" class="tab">DO1号</button>
        <button id="do2-tab" class="tab">DO2号</button>
        <button id="do3-tab" class="tab">DO3号</button>
    </div>

    <button id="chart-toggle-button">
        グラフを表示
    </button>

    <div id="chart-container" style="display: none;">
     
    </div>

    <div id="table-container">
        データを読み込み中...
    </div>
`;
}
const waterTab = document.getElementById("water-tab");
const salinityTab = document.getElementById("salinity-tab");
const do1Tab = document.getElementById("do1-tab");
const do2Tab = document.getElementById("do2-tab");//追加
const do3Tab = document.getElementById("do3-tab");

//グラフ表示ボタン
const chartToggleButton =
    document.getElementById("chart-toggle-button");
const chartContainer =
    document.getElementById("chart-container");

let currentSensorType = "salinity";

waterTab?.addEventListener("click", () => {
    currentSensorType = "water";
    setActiveTab(waterTab);
    loadTable(API_URLS.water, "water");
});

salinityTab?.addEventListener("click", () => {
    currentSensorType = "salinity";
    setActiveTab(salinityTab);
    loadTable(API_URLS.salinity, "salinity");

    if (isChartVisible) {
        loadChart(API_URLS.salinity, "salinity");
    }
});

do1Tab?.addEventListener("click", () => {
    currentSensorType = "do1";

    setActiveTab(do1Tab);
    loadTable(API_URLS.do1, "do1");

    if (isChartVisible) {
        loadChart(API_URLS.do1, "do1");
    }
});

do2Tab?.addEventListener("click", () => {
    currentSensorType = "do2";

    setActiveTab(do2Tab);

    // API は未準備なので、準備中の表示だけ出す
    const tableContainer = app?.querySelector("#table-container");
    if (tableContainer) {
        tableContainer.textContent = "準備中・・・";
    }

    if (chartContainer) {
        chartContainer.textContent = "準備中・・・";
    }
});

do3Tab?.addEventListener("click", () => {
    currentSensorType = "do3";

    setActiveTab(do3Tab);
    loadTable(API_URLS.do3, "do3");

    if (isChartVisible) {
        loadChart(API_URLS.do3, "do3");
    }
});

//グラフ表示ボタン
chartToggleButton?.addEventListener("click", () => {
    isChartVisible = !isChartVisible;

    if (isChartVisible) {
        chartContainer!.style.display = "block";

        chartToggleButton.textContent = "グラフを非表示";
        if (currentSensorType === "do2") {
            chartContainer!.textContent = "完成をお待ちください(｀・ω・´)";
        } else {
            loadChart(
                API_URLS[currentSensorType as keyof typeof API_URLS],
                currentSensorType
            );
        }

        // グラフを描画
    } else {
        chartContainer!.style.display = "none";

        chartToggleButton.textContent = "グラフを表示";
    }
});

//グラフ描画
async function loadChart(
    apiUrl: string,
    sensorType: string
) {
    const data = await fetchData(apiUrl);

    if (!data) return;

    if (!chartContainer) return;

renderChart(
    data,
    sensorType,
    chartContainer
);
}

// API からデータを取得して表を反映
async function loadTable(apiUrl: string, sensorType: string) {
    const data = await fetchData(apiUrl);

    const container = app?.querySelector("#table-container");

    if (!container) return;

    container.textContent = "読み込み中...";

    if (data !== null) {
        container.innerHTML = renderTable(data, sensorType);

    } else {
        container.textContent = "データの取得に失敗しました。";
    }
}

loadTable(API_URLS.salinity, "salinity");