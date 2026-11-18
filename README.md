# University Rankings Data Analysis

## Project Overview

This project analyzes changes in U.S. university rankings over time, with a particular focus on the University of California (UC) system and UC Santa Barbara (UCSB).

Using Python, Javascript, university ranking datasets, and interactive visualizations, the project explores how university rankings have shifted, identifies trends among public and private institutions, and compares the performance of UC campuses.

The analysis was developed to support a data-driven article for *The Daily Nexus*, UC Santa Barbara's independent student newspaper, examining UCSB's changing position in national university rankings.

## Project Objectives

- Analyze historical changes in national university rankings.
- Compare ranking trends across UC campuses and other universities.
- Identify universities experiencing significant increases or decreases in rankings.
- Develop heatmaps to visualize changes over time.


## File Descriptions

### Data Analysis and Notebooks

| File | Description |
|---|---|
| `analysis_rankings.ipynb` | Main Jupyter Notebook containing Python-based analysis of historical university rankings. |
| `for_fun_analysis.ipynb` | Additional exploratory data analysis and experimentation. |
| `javascript_analysis.ipynb` | Notebook used for JavaScript visualization development and experimentation. |
| `javascript_analysis.ts` | TypeScript source file for ranking analysis and visualization development. |
| `javascript_analysis.html` | HTML output of JavaScript-related analysis. |
| `java_analysis` | Additional JavaScript-related analysis file. |

### Ranking and Institutional Data

| File | Description |
|---|---|
| `UniversityRankings.csv` | Historical national university rankings used to compare institutional performance over time. |
| `hd2024.csv` | IPEDS institutional characteristics dataset for 2024. |
| `hd2024.xlsx` | Excel version of the 2024 institutional characteristics dataset. |
| `Data_11-5-2026.csv` | Additional data file used in the analysis. |
| `Data_11-5-2026_2.csv` | Additional data file used in the analysis. |
| `faculty_sal.csv` | Faculty salary dataset used for institutional comparisons. |

### UC Financial and Institutional Analysis

| File | Description |
|---|---|
| `uc_faculty_salaries.csv` | Dataset comparing faculty salaries across UC campuses. |
| `uc_faculty_salaries_detailed.csv` | Detailed faculty compensation data used for further analysis. |
| `uc_faculty_salaries_flourish.csv` | Faculty salary data formatted for visualization in Flourish. |
| `uc_financial_resources_detailed.csv` | Detailed financial resources data used for comparisons between UC campuses. |
| `uc_financial_resources_flourish.csv` | Financial resources dataset formatted for visualization in Flourish. |
| `uc_spending_per_student.csv` | Dataset comparing university spending per student across UC campuses. |

### IPEDS Data Validation

| File | Description |
|---|---|
| `uc_ipeds_audit_issues.csv` | Records of identified issues in the IPEDS datasets. |
| `uc_ipeds_audit_long_data.csv` | IPEDS data organized in long format for auditing and analysis. |
| `uc_ipeds_audit_summary.csv` | Summary of IPEDS data audit results. |
| `uc_ipeds_status_flags.csv` | Status flags used to identify or track IPEDS data conditions. |

### Interactive Visualizations

| File | Description |
|---|---|
| `UniversityRankingsHeatmap.html` | Interactive visualization of historical national university rankings. |
| `public_university_heatmap.html` | Heatmap comparing national ranking trends among public universities. |
| `uc_rankings_heatmap.html` | Heatmap comparing historical rankings across University of California campuses. |
| `uc_graduation_rates.html` | HTML visualization of graduation rates across UC campuses. |

### Project Configuration

| File | Description |
|---|---|
| `package.json` | Node.js configuration and project dependencies. |
| `package-lock.json` | Dependency lockfile for reproducible installation. |
| `README.md` | Project overview, documentation, and instructions. |


## How to Explore the Project

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Explore the analysis notebooks:**

   - `analysis_rankings.ipynb` — Python notebook containing historical university ranking analysis and institutional comparisons.
   - `javascript_analysis.ipynb` — Notebook containing the analysis and visualizations developed for the investigative article in *The Daily Nexus*.
   - `for_fun_analysis.ipynb` — Additional exploratory analysis using Java.

3. **View the interactive visualizations:**

   Open the following HTML files in a web browser:

   - `UniversityRankingsHeatmap.html` — Historical national university ranking trends.
   - `public_university_heatmap.html` — Rankings of public universities.
   - `uc_rankings_heatmap.html` — Ranking comparisons across UC campuses.
   - `uc_graduation_rates.html` — Graduation rate comparisons across UC campuses.

4. **Explore the institutional datasets:**

   - `uc_spending_per_student.csv` — University spending per student.
   - `uc_faculty_salaries.csv` — Faculty salary comparisons.
   - `uc_financial_resources_detailed.csv` — Institutional financial resources.
   - `uc_ipeds_audit_summary.csv` — Summary of IPEDS data validation.

5. **Explore the JavaScript components:**

   The JavaScript and TypeScript files contain additional visualization development work. To install the project dependencies, run:

   ```bash
   npm install
   ```

   The HTML visualizations can be opened directly in a browser without installing Node.js dependencies.

## Data Sources

The project uses historical university rankings and institutional datasets, including:

- Andrew Reiter's University Rankings Dataset — Historical university ranking data 
- U.S. News & World Report — Best National Universities rankings
- Integrated Postsecondary Education Data System (IPEDS) — Institutional data

## Author

**Karla Hernandez**  
