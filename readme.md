

### **Resume Analyzer & Enhancer**

#### Overview:

This feature takes a user’s resume (via Google Drive link), evaluates its effectiveness using AI, and provides actionable insights along with a fully rewritten version tailored to ATS standards and job-specific requirements.

---

### **How It Works**

1. **Resume Upload**
   The user provides a **Google Drive URL** to their resume document (PDF or DOCX).

2. **Text Extraction**
   The resume text is extracted using document loaders (e.g., `pdfjs-dist` or LangChain’s PDF loader).

3. **AI Analysis Using Gemini**
   The extracted resume is processed through Gemini AI, which:

   * Understands the structure of the resume (e.g., Summary, Experience, Skills).
   * Evaluates the content based on **ATS compliance** and **job relevance**.
   * Identifies strengths, gaps, missing information, and formatting issues.
   * Compares listed skills with commonly required keywords for the selected job role.

---

### **Insights Provided by the Analyzer**

* **ATS Score**
  A numerical score representing how likely the resume is to pass automated Applicant Tracking Systems.

* **Weak Section Detection**
  Flags sections like Summary, Skills, or Experience that are too short, generic, or missing.

* **Skill & Keyword Matching**
  Evaluates whether the resume includes job-relevant tools, technologies, and soft skills.

* **Strengths & Areas for Improvement**
  Offers detailed observations on well-written achievements and areas needing more specificity or metrics.

---

### **Post-Analysis Options**

Once the analysis is complete, the user can choose one of the following:

#### 1. **AI Suggestions**

* Field-specific improvement tips (e.g., “Add project impact metrics” or “Expand technical skills with current frameworks”).
* Recommendations on structure, tone, and keyword usage.
* Tailored advice based on the target job type (Frontend, Backend, Data Science, etc.).

#### 2. **Resume Rebuilder**

* Automatically generates a **professional, ATS-optimized resume** using Gemini AI.
* Enhancements include:

  * Clear formatting and logical sectioning
  * Strong action verbs and measurable achievements
  * Better alignment with job descriptions
  * Improved readability and consistency

---

### **Technologies Used**

| Feature                        | Technology/Tool                                      |
| ------------------------------ | ---------------------------------------------------- |
| Resume upload & parsing        | LangChain PDF Loader, `pdfjs-dist`, Google Drive URL |
| Text analysis                  | LangChain + Gemini API                               |
| ATS scoring & keyword checking | Custom prompt templates, field-specific keyword sets |
| Resume rewriting               | Gemini AI with structured section-wise prompts       |
| UI and content rendering       | Markdown + React-based resume viewer/editor          |

---

### **Example User Workflow**

1. User submits resume via Google Drive link.
2. System extracts and analyzes the content using Gemini.
3. AI returns detailed feedback, ATS score, and suggestions.
4. User chooses to either review suggestions or generate a new improved version.
5. Final resume is presented, ready to download, copy, or edit.

