**Take-Home Assessment**

**Intern Developer \- Full-Stack CRM Application**

*Full-stack assessment for frontend, backend, database, authentication, and product thinking*

# **Goal**

Build a working full-stack CRM application that demonstrates your ability to:

* Build a frontend UI.  
* Create backend APIs.  
* Use a database.  
* Implement authentication.  
* Handle CRUD operations.  
* Debug independently.  
* Explain your work clearly.

# **Task**

Build a simple CRM Lead Management System for a small sales team.

The app should allow users to manage sales leads, track their progress through a sales pipeline, add notes, and view a basic dashboard.

# **What is a CRM?**

A CRM stands for Customer Relationship Management system.

It is software used by businesses to manage leads, prospects, and customers. Sales teams use CRMs to track communication, manage opportunities, and understand where each lead is in the sales process.

Key concepts:

* **Lead:** A potential customer.  
* **Lead Source:** Where the lead came from, such as website, LinkedIn, referral, cold email, or event.  
* **Sales Pipeline:** The stages a lead goes through before becoming a customer.  
* **Lead Status:** The current stage of a lead, such as New, Contacted, Qualified, Proposal Sent, Won, or Lost.  
* **Deal Value:** The estimated value of the potential sale.  
* **Notes:** Internal updates added after calls, emails, meetings, or follow-ups.

You may research tools like HubSpot, Pipedrive, Zoho CRM, Salesforce, Airtable CRM templates, or Notion CRM templates for inspiration. Do not copy an existing CRM directly.

# **Core Requirements**

## **1\. Authentication**

Add a simple login system. You may use email/password login, JWT, sessions, or hardcoded test users.

At minimum, include one test user:

| Email | admin@example.com |
| :---- | :---- |
| **Password** | password123 |

The CRM should not be accessible without logging in.

## **2\. Lead Management**

Users should be able to:

* Create leads.  
* View leads.  
* Edit leads.  
* Delete leads.  
* Update lead status.  
* View lead details.

Each lead should include:

* Lead Name  
* Company Name  
* Email  
* Phone Number  
* Lead Source  
* Assigned Salesperson  
* Status  
* Estimated Deal Value  
* Created Date  
* Last Updated Date

Example statuses: New, Contacted, Qualified, Proposal Sent, Won, Lost.

## **3\. Lead Notes**

Users should be able to add notes to a lead. Each note should include:

* Note Content  
* Created By  
* Created Date

## **4\. Dashboard**

Create a simple dashboard showing:

* Total Leads  
* New Leads  
* Qualified Leads  
* Won Leads  
* Lost Leads  
* Total Estimated Deal Value  
* Total Value of Won Deals

## **5\. Search and Filtering**

The lead list should support filtering by:

* Status  
* Lead Source  
* Assigned Salesperson

Bonus if search is included for lead name, company name, or email.

# **Technical Requirements**

The application must include:

* Frontend.  
* Backend API.  
* Database or persistent storage.  
* Authentication.  
* CRUD functionality.  
* Clear setup instructions.

You may use any stack you are comfortable with. Suggested stack options:

| Area | Suggested Technologies |
| :---- | :---- |
| **Frontend** | React, Next.js, Vue, Angular |
| **Backend** | Node.js, Express, NestJS, Django, Laravel, FastAPI |
| **Database** | PostgreSQL, MySQL, SQLite, MongoDB, Firebase, Supabase |
| **Styling** | Tailwind CSS, Bootstrap, Material UI, Mantine, plain CSS |

# **Guidance**

You may use documentation, tutorials, Stack Overflow, AI tools, and open-source references.

You must understand the code you submit and be able to explain it in your demo.

This assessment is not about memorization. It is about learning, problem-solving, building, and explaining.

# **Deliverables**

Submit a public GitHub repository with:

* Source code.  
* README file.  
* Setup instructions.  
* Test login credentials.  
* Database setup instructions.  
* Short reflection note.  
* Demo video link.

Your README should explain:

* Project overview  
* Tech stack used  
* Features implemented  
* How to run locally  
* Environment variables  
* Test login credentials  
* Database setup  
* Known limitations  
* Reflection

# **Demo Video**

Submit a 5 to 10 minute demo video showing:

* How to run the project.  
* Login flow.  
* Dashboard.  
* Creating a lead.  
* Editing a lead.  
* Updating lead status.  
* Adding notes.  
* Searching or filtering leads.  
* Brief backend and database explanation.

# **Time Expectation**

This task is scoped to approximately 8 to 12 hours of effort.

You may take up to **3 days** to submit.

We are not expecting perfection. We are evaluating whether you can build, debug, learn independently, and explain your work.

# **Evaluation Criteria**

We will evaluate:

* Whether the app runs locally.  
* Whether authentication works.  
* Whether lead CRUD works.  
* Whether notes work.  
* Whether dashboard data is shown correctly.  
* Whether search or filtering works.  
* Whether data persists.  
* Code quality.  
* Database design.  
* UI/UX.  
* Error handling.  
* README quality.  
* Demo explanation.  
* Reflection quality.  
* Independence and problem-solving ability.

# **Bonus Points**

Bonus points will be awarded for thoughtful additions that improve the CRM from a real sales team’s perspective.

This may include technical improvements, UI/UX improvements, workflow improvements, automation ideas, reporting features, lead enrichment, or any other creative functionality that makes the CRM more useful in practice.

We highly value creativity, but features should still be practical. Strong bonus features should help a sales team save time, prioritize better, track leads more clearly, or close more deals.

# **What Not To Submit**

Do not submit:

* A static frontend with no backend.  
* A backend with no frontend.  
* A project that cannot be run locally.  
* A repo without setup instructions.  
* Code copied directly from a tutorial without understanding it.  
* Exposed API keys, database passwords, or secrets.  
* A demo video that only shows the UI without explaining the technical implementation.  
* Private or restricted links.

# **Assignment Submission**

Submit the following:

## **1\. GitHub Repository Link**

* The repository must be public.  
* Private repositories or inaccessible links will not be reviewed.

## **2\. Demo Video Link**

* Submit a YouTube, Loom, or Google Drive link.  
* The video must be accessible to anyone with the link.  
* Private or restricted video links will not be reviewed.

## **3\. Deployed Application Link**

* Submit a deployed application link if available.  
* If the app is not deployed, mention that it was not deployed.  
* If login is required, include test credentials in the README.

***Before submitting, test all links in an incognito/private browser window to confirm they are accessible.***

# **Assignment Submission Form: [https://airtable.com/app9kXuirRbKEJ88P/pag1nNFlinQLeevO1/form](https://airtable.com/app9kXuirRbKEJ88P/pag1nNFlinQLeevO1/form)**

