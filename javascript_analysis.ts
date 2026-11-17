 // Heatmap of university rankings (2016–2027)

const fs = await import("node:fs");

const years = Array.from(
  { length: 12 },
  (_, i) => String(2016 + i)
);

// 1. READ CSV FILE

const csv = fs.readFileSync(
  "UniversityRankings.csv",
  "utf8"
);

// Parse CSV, including quoted fields and commas

function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  text = text.replace(/^\uFEFF/, "");

  for (let i = 0; i < text.length; i++) {
    const c = text[i];

    if (c === '"') {
      if (quoted && text[i + 1] === '"') {
        field += '"';
        i++;
      } else {
        quoted = !quoted;
      }
    } else if (c === "," && !quoted) {
      row.push(field);
      field = "";
    } else if ((c === "\n" || c === "\r") && !quoted) {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);

      if (row.some(v => v.trim() !== "")) {
        rows.push(row);
      }

      row = [];
      field = "";
    } else {
      field += c;
    }
  }

  row.push(field);

  if (row.some(v => v.trim() !== "")) {
    rows.push(row);
  }

  const headers = rows.shift().map(h => h.trim());

  return rows.map(values =>
    Object.fromEntries(
      headers.map((h, i) => [h, values[i] ?? ""])
    )
  );
}

const data = parseCSV(csv);


// 2. CONVERT RANKINGS TO NUMBERS

const rankings = data.map(row => {
  const university = {
    name: row["University Name"] === "College of William and Mary"
  ? "College of William & Mary"
  : row["University Name"],
    ipeds: row["IPEDS"]
  };

  years.forEach(year => {
    const value = String(row[year] ?? "").trim();
    const number = value === "" ? NaN : Number(value);

    university[year] = Number.isFinite(number)
      ? number
      : null;
  });

  return university;
});


// 3. SELECT UNIVERSITIES RANKED TOP 50 IN 2016

const top50 = rankings
  .filter(row =>
    row["2016"] !== null &&
    row["2016"] <= 50
  )
  .sort((a, b) => a["2016"] - b["2016"]);

const universities = top50.map(row => row.name);


// 4. PREPARE HEATMAP DATA

const z = top50.map(row =>
  years.map(year => {
    const value = row[year];

    return value !== null && value <= 50
      ? value
      : null;
  })
);

// All displayed ranking labels

const labels = top50.map(row =>
  years.map(year => {
    const value = row[year];

    if (value === null) return "";
    if (value > 50) return ">50";

    return String(Math.trunc(value));
  })
);


// 5. CREATE HEATMAP

// Gray background for every cell

const background = {
  z: top50.map(() => years.map(() => 1)),
  x: years,
  y: universities,
  type: "heatmap",

  colorscale: [
    [0, "lightgrey"],
    [1, "lightgrey"]
  ],

  showscale: false,
  hoverinfo: "skip",

  xgap: 1,
  ygap: 1
};


// Blue cells for ranks 1 through 50

const heatmap = {
  z: z.map(row =>
    row.map(v => v === null ? null : 51 - v)
  ),

  x: years,
  y: universities,
  type: "heatmap",

  colorscale: [
    [0.00, "#F7FBFF"],
    [0.20, "#DEEBF7"],
    [0.40, "#BDD7E7"],
    [0.60, "#6BAED6"],
    [0.80, "#2171B5"],
    [1.00, "#08306B"]
  ],

  zmin: 1,
  zmax: 50,

  colorbar: {
    title: "Rank",
    tickvals: [1, 11, 21, 31, 41, 50],
    ticktext: ["50", "40", "30", "20", "10", "1"]
  },

  xgap: 1,
  ygap: 1
};


// 6. CREATE TEXT LABELS

const annotations = [];

top50.forEach((row, i) => {
  years.forEach(year => {
    const value = row[year];

    let label = "";
    let fontColor = "black";

    if (value === null) {
      label = "";
    } else if (value > 50) {
      label = ">50";
    } else {
      label = String(Math.trunc(value));

      if (value <= 20) {
        fontColor = "white";
      }
    }

    if (label !== "") {
      annotations.push({
        x: year,
        y: universities[i],
        text: label,
        showarrow: false,

        font: {
          size: 10,
          color: fontColor
        }
      });
    }
  });
});


// 7. CHART LAYOUT

const layout = {
  title: "University rankings (2016–2027)",

  width: 1100,

  height: Math.max(
    800,
    universities.length * 28
  ),

  // Match second heatmap's left margin

  margin: {
    l: 450,
    r: 100,
    t: 70,
    b: 80
  },

  xaxis: {
    title: "Year",

    tickmode: "array",
    tickvals: years,
    ticktext: years,
    tickangle: -45,
    side: "bottom"
  },

  yaxis: {
    // Remove automatic y-axis title

    title: "",

    autorange: "reversed",

    type: "category",
    categoryorder: "array",
    categoryarray: universities
  },

  // Ranking labels plus custom y-axis title

  annotations: [
    ...annotations,

    {
      text: "University",
      xref: "paper",
      yref: "paper",

      x: 0,
      y: 0.5,

      xshift: -395,
      textangle: -90,

      showarrow: false,

      font: {
        size: 14,
        color: "black"
      }
    }
  ],

  plot_bgcolor: "lightgrey"
};



 // 8. GENERATE HTML VISUALIZATION

// Bold UCSB in the y-axis labels
const boldUniversityLabels = universities.map(name =>
  name.includes("Santa Barbara")
    ? "<b>" + name + "</b>"
    : name
);

// Apply formatted labels without changing heatmap data
layout.yaxis.tickmode = "array";
layout.yaxis.tickvals = universities;
layout.yaxis.ticktext = boldUniversityLabels;

const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>University Rankings Heatmap</title>

<script src="https://cdn.plot.ly/plotly-2.35.2.min.js"></script>

</head>

<body>

<div id="heatmap"></div>

<p style="
  max-width: 1100px;
  font-family: Arial, sans-serif;
  font-size: 13px;
  color: #555;
  line-height: 1.5;
  margin: 12px 0 20px 0;
">
From 2016 to 2027, public schools experienced an average decline
of 2.2 positions in U.S. News rankings, while private schools'
rankings rose 2.63 positions on average. The median change was
a decline of four positions for public schools and an increase
of one position for private universities.
</p>

<p style="
  max-width: 1100px;
  font-family: Arial, sans-serif;
  font-size: 12px;
  color: #555;
  line-height: 1.6;
  margin: 0 0 20px 0;
">
  Source:
  <a href="https://www.usnews.com/best-colleges"
     target="_blank"
     rel="noopener noreferrer"
     style="color: #2171B5; text-decoration: underline;">
    Andrew Reiter Dataset
  </a>
  <br>
  Chart: Karla Hernandez
</p>

<script>

const background = ${JSON.stringify(background)};
const heatmap = ${JSON.stringify(heatmap)};
const layout = ${JSON.stringify(layout)};

Plotly.newPlot(
  "heatmap",
  [background, heatmap],
  layout
);

</script>

</body>
</html>
`;


// 9. SAVE HTML FILE

fs.writeFileSync(
  "UniversityRankingsHeatmap.html",
  html
);




// Heatmap of top 50 public universities from 2016–2027

const { createRequire } = await import("node:module");
const require = createRequire(process.cwd() + "/package.json");

const fs = require("node:fs");
const { parse } = require("csv-parse/sync");


// 1. READ CSV FILES

let UniversityRankings = parse(
    fs.readFileSync("UniversityRankings.csv", "utf8"),
    { columns: true, skip_empty_lines: true, bom: true }
);

const ipeds = parse(
    fs.readFileSync("hd2024.csv", "utf8"),
    { columns: true, skip_empty_lines: true, bom: true }
);


// 2. CLASSIFY PUBLIC AND PRIVATE SCHOOLS

const typeMap = {
    1: "Public",
    2: "Private Nonprofit",
    3: "Private For-Profit"
};

const ipedsMap = new Map();

for (const row of ipeds) {
    const id = String(row.UNITID).trim();

    if (ipedsMap.has(id)) {
        throw new Error(`Duplicate IPEDS UNITID: ${id}`);
    }

    ipedsMap.set(
        id,
        typeMap[Number(row.CONTROL)] || null
    );
}

UniversityRankings = UniversityRankings.map(row => ({
    ...row,
    UNITID: row.IPEDS,
    Type: ipedsMap.get(String(row.IPEDS).trim()) || null
}));


// 3. FILTER PUBLIC UNIVERSITIES

let Public = UniversityRankings.filter(
    row => row.Type === "Public"
);


// 4. CONVERT RANKINGS TO NUMBERS

const years = [
    "2016", "2017", "2018", "2019",
    "2020", "2021", "2022", "2023",
    "2024", "2025", "2026", "2027"
];

Public = Public.map(row => {
    const result = { ...row };

    for (const year of years) {
        const value = String(row[year] ?? "").trim();

        result[year] =
            value !== "" && Number.isFinite(Number(value))
                ? Number(value)
                : null;
    }

    return result;
});


// Manually correct Texas A&M's 2023 overall rank to 67

Public = Public.map(row => {
    if (
        row["University Name"] ===
        "Texas A&M University-College Station"
    ) {
        return {
            ...row,
            "2023": 67
        };
    }

    return row;
});


// 5. RANK PUBLIC UNIVERSITIES EACH YEAR

for (const year of years) {

    const sortedRanks = Public
        .map(row => row[year])
        .filter(value => value !== null)
        .sort((a, b) => a - b);

    const rankingMap = new Map();

    sortedRanks.forEach((value, index) => {
        if (!rankingMap.has(value)) {
            rankingMap.set(value, index + 1);
        }
    });

    Public = Public.map(row => ({
        ...row,
        [year]: row[year] === null
            ? null
            : rankingMap.get(row[year])
    }));
}


// 6. SELECT TOP 50 PUBLIC UNIVERSITIES
// BASED ON 2016

const Top50Public = Public
    .filter(row =>
        row["2016"] !== null &&
        row["2016"] <= 50
    )
    .sort((a, b) => a["2016"] - b["2016"]);


// 7. PREPARE HEATMAP DATA

const universityNames = Top50Public.map(row =>
    row["University Name"] === "College of William and Mary"
        ? "College of William & Mary"
        : row["University Name"]
);

// Reverse ranking values for colors
// Rank 1 = 50
// Rank 50 = 1
// Rank >50 or missing = gray

const z = Top50Public.map(row =>
    years.map(year => {
        const rank = row[year];

        return rank === null || rank > 50
            ? null
            : 51 - rank;
    })
);

// Actual rankings displayed inside cells

const labels = Top50Public.map(row =>
    years.map(year => {
        const rank = row[year];

        return rank === null || rank > 50
            ? ">50"
            : String(Math.trunc(rank));
    })
);


// 8. CREATE HEATMAP

// Gray background for cells ranked above 50

const background = {
    type: "heatmap",

    x: years,
    y: universityNames,

    z: Top50Public.map(() =>
        years.map(() => 1)
    ),

    colorscale: [
        [0, "lightgrey"],
        [1, "lightgrey"]
    ],

    showscale: false,
    hoverinfo: "skip",

    xgap: 1,
    ygap: 1
};


// Blue colors for ranks 1 through 50

const blueScale = [
    [0.00, "#F7FBFF"],
    [0.20, "#DEEBF7"],
    [0.40, "#BDD7E7"],
    [0.60, "#6BAED6"],
    [0.80, "#2171B5"],
    [1.00, "#08306B"]
];

const heatmap = {
    type: "heatmap",

    x: years,
    y: universityNames,
    z: z,

    text: labels,

    colorscale: blueScale,

    zmin: 1,
    zmax: 50,

    xgap: 1,
    ygap: 1,

    hovertemplate:
        "University: %{y}<br>" +
        "Year: %{x}<br>" +
        "Public Rank: %{text}<extra></extra>",

    colorbar: {
        title: "Public Rank",
        tickvals: [1, 11, 21, 31, 41, 50],
        ticktext: ["50", "40", "30", "20", "10", "1"]
    },

    showscale: true
};


// 9. CREATE TEXT LABELS

const whiteX = [];
const whiteY = [];
const whiteText = [];

const blackX = [];
const blackY = [];
const blackText = [];

Top50Public.forEach((row, i) => {
    years.forEach((year, j) => {

        const rank = row[year];
        const label = labels[i][j];

        if (rank !== null && rank <= 20) {
            whiteX.push(year);
            whiteY.push(universityNames[i]);
            whiteText.push(label);
        } else {
            blackX.push(year);
            blackY.push(universityNames[i]);
            blackText.push(label);
        }
    });
});


const whiteLabels = {
    type: "scatter",
    mode: "text",

    x: whiteX,
    y: whiteY,
    text: whiteText,

    textfont: {
        color: "white",
        size: 10
    },

    hoverinfo: "skip",
    showlegend: false
};


const blackLabels = {
    type: "scatter",
    mode: "text",

    x: blackX,
    y: blackY,
    text: blackText,

    textfont: {
        color: "black",
        size: 10
    },

    hoverinfo: "skip",
    showlegend: false
};


// 10. HEATMAP LAYOUT

const layout = {
    title: "Top 50 public universities (2016–2027)",

    width: 1100,

    height: Math.max(
        800,
        universityNames.length * 28
    ),

        margin: {
        l: 450,
        r: 100,
        t: 70,
        b: 80
    },

    xaxis: {
        title: "Year",

        tickmode: "array",
        tickvals: years,
        ticktext: years,
        tickangle: -45,
        side: "bottom",

        type: "category",
        categoryorder: "array",
        categoryarray: years,

        range: [-0.5, years.length - 0.5]
    },

    yaxis: {
        // Remove default y-axis title
        // to prevent overlapping text

        title: "",

        type: "category",
        categoryorder: "array",
        categoryarray: universityNames,

        range: [
            universityNames.length - 0.5,
            -0.5
        ]
    },

    // Add one separate y-axis title

    annotations: [
    {
        text: "Public university",
        xref: "paper",
        yref: "paper",
        x: 0,
        y: 0.5,
        xshift: -395,
        textangle: -90,
        showarrow: false,
        font: {
            size: 14,
            color: "black"
        }
    }
],

    plot_bgcolor: "white",
    paper_bgcolor: "white",

    showlegend: false
};


// 11. SAVE INTERACTIVE HEATMAP AS HTML

const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Public University Rankings Heatmap</title>

    <script src="https://cdn.plot.ly/plotly-2.35.2.min.js"></script>
</head>

<body>

<div id="heatmap"></div>

<p style="
    max-width: 1100px;
    font-family: Arial, sans-serif;
    font-size: 12px;
    color: #555;
    line-height: 1.6;
    margin: 12px 0 20px 0;
">
    Source:
    <a href="https://www.usnews.com/best-colleges"
       target="_blank"
       rel="noopener noreferrer"
       style="color: #2171B5; text-decoration: underline;">
        Andrew Reiter Dataset
    </a>
    <br>
    Chart: Karla Hernandez
</p>

<script>
    const data = ${JSON.stringify([
        background,
        heatmap,
        whiteLabels,
        blackLabels
    ])};

    const layout = ${JSON.stringify(layout)};

    // Bold the UCSB label

    function boldUCSB() {
        const labels = document.querySelectorAll(
            "#heatmap .ytick text"
        );

        labels.forEach(label => {
            if (label.textContent.includes("Santa Barbara")) {
                label.setAttribute("font-weight", "bold");
                label.style.fontWeight = "700";
            }
        });
    }

    Plotly.newPlot(
        "heatmap",
        data,
        layout,
        {
            responsive: true,
            displayModeBar: true,

            toImageButtonOptions: {
                format: "png",
                filename: "public_university_heatmap",
                scale: 2
            }
        }
    ).then(() => {
        boldUCSB();
    });

    // Keep UCSB bold if the chart redraws

    document.getElementById("heatmap").on(
        "plotly_afterplot",
        boldUCSB
    );

</script>

</body>
</html>
`;

fs.writeFileSync(
    "public_university_heatmap.html",
    html
);
