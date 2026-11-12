# FairPay AI 💙
### Every Payment Deserves a Fair Resolution.

**FairPay AI** is an AI-powered payment resolution platform designed to help businesses handle customer payment complaints more intelligently, transparently, and efficiently.

By combining PayPal transaction information, customer complaints, merchant-provided order evidence, explainable risk assessment, and AI-generated recommendations, FairPay AI helps merchants make informed resolution decisions while keeping final control in human hands.

---

## 🚀 The Problem

Online payment disputes create challenges for both customers and merchants.

Consider this scenario:

A customer purchases headphones worth **$100 through PayPal**. The payment succeeds, but the delivery is delayed. The customer contacts the merchant requesting a refund.

The merchant must:
- Locate the original transaction.
- Understand the customer's complaint.
- Verify order and delivery information.
- Assess the situation and possible dispute risks.
- Decide whether a refund is appropriate.
- Communicate the resolution to the customer.

Handling these steps manually can be time-consuming, inconsistent, and frustrating.

## 💡 Our Solution

FairPay AI brings these activities together in one intelligent resolution platform.

It helps merchants:
- Analyze customer complaints using AI.
- Retrieve relevant PayPal transaction information.
- Combine payment data with merchant-provided order and delivery evidence.
- Identify explainable risk indicators.
- Receive AI-generated resolution recommendations.
- Review and approve refunds.
- Track case progress through a transparent activity timeline.

**Our key principle: AI recommends. Humans decide.**

---

## ✨ Key Features

### 1. AI-Powered Complaint Analysis
Uses a large language model to understand customer complaints, identify the underlying issue, classify the complaint, and generate concise summaries.

### 2. Explainable Risk Assessment
Highlights relevant case indicators, such as:
- Delayed delivery.
- Missing delivery confirmation.
- Unresolved customer communication.
- Incomplete order evidence.

The assessment uses transparent rules and explanations rather than presenting an unverified score as a true probability of chargeback.

### 3. Intelligent Resolution Recommendations
Provides context-aware suggestions to help merchants decide whether to investigate further, request additional evidence, communicate with the customer, or consider a refund.

### 4. PayPal Integration
Designed to integrate with PayPal APIs for transaction creation, payment capture, and merchant-approved refunds through PayPal Sandbox.

### 5. Merchant-Controlled Refunds
Merchants review the evidence and AI recommendation before authorizing a refund. The backend validates the payment and refundable amount before sending the refund request.

### 6. Customer Complaint Portal
Allows customers to submit complaints and follow their resolution progress.

### 7. Transparent Activity Logs
Maintains a timeline of important case actions, decisions, and refund status updates.

### 8. Analytics Dashboard
Provides an overview of payments, complaints, refunds, resolution activity, and operational trends.

---

## 🔄 How FairPay AI Works

```mermaid
flowchart TD
    A[Customer Makes PayPal Payment] --> B[Customer Submits Complaint]
    B --> C[Retrieve PayPal Transaction]
    C --> D[Collect Merchant Order and Delivery Evidence]
    D --> E[AI Complaint Analysis]
    E --> F[Explainable Risk Assessment]
    F --> G[AI Resolution Recommendation]
    G --> H{Merchant Review}
    H -->|Approve Refund| I[Validate Refund Request]
    H -->|Request More Evidence| J[Investigate Further]
    H -->|Choose Another Resolution| K[Record Merchant Decision]
    I --> L[PayPal Refund API]
    L --> M[Update Case and Activity Timeline]
    J --> M
    K --> M
    M --> N[Customer Tracks Resolution]
```

### Real-Time Example

| Stage | What happens |
|---|---|
| Payment | Customer pays $100 for headphones |
| Complaint | Customer reports delayed delivery |
| Data collection | PayPal transaction and merchant order details are retrieved |
| AI analysis | Complaint is summarized and classified |
| Risk assessment | Delayed delivery and missing proof are highlighted |
| Recommendation | FairPay suggests an appropriate resolution |
| Approval | Merchant reviews and approves a refund |
| Refund | Approved refund is submitted through PayPal |
| Tracking | Case status and activity history are updated |

---

## 🌟 What Makes FairPay AI Different?

| Traditional Process | FairPay AI |
|---|---|
| Manual complaint review | AI-assisted complaint analysis |
| Scattered payment and order information | Unified case information |
| Unclear dispute indicators | Explainable risk factors |
| Manual resolution decisions without structured guidance | Context-aware recommendations |
| Limited visibility into case progress | Transparent activity timeline |
| Separate refund workflow | Integrated merchant-controlled refund workflow |

### Our Unique Approach

**Explainability + Human Oversight + Payment Integration**

FairPay AI does not attempt to replace merchant judgment. It combines AI-powered assistance with transparent reasoning and controlled payment actions.

This makes the resolution process more understandable, accountable, and customer-focused.

---

## 🏗️ System Architecture

```mermaid
flowchart TB
    U[Merchant / Customer] --> F[Next.js Frontend]
    F --> B[FastAPI Backend]
    B --> DB[(PostgreSQL Database)]
    B --> AI[Groq LLM]
    B --> R[Rule-Based Risk Engine]
    B --> P[PayPal REST APIs]
    P --> B
    B --> F
    F --> U
```

### Technology Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js, React, TypeScript |
| UI Styling | Tailwind CSS |
| Backend | Python, FastAPI |
| Database | PostgreSQL |
| AI / LLM | Groq API |
| Risk Assessment | Explainable rule-based engine |
| Payment Integration | PayPal Developer APIs |
| API Testing | Postman |
| Version Control | Git and GitHub |
| Deployment | Render (planned / as configured) |

*Update this table to reflect the technologies actually implemented in your final submission.*

---

## 🔐 Security and Responsible AI

FairPay AI is designed around secure payment handling and responsible AI practices.

- API credentials are stored in backend environment variables.
- PayPal client secrets are never exposed in frontend code.
- Merchant approval is required before refund execution.
- Refund requests are validated before submission.
- Duplicate refund requests are guarded against.
- Case actions and decisions are recorded for transparency.
- AI recommendations are treated as decision support, not automatic financial decisions.

---

## 🛠️ Installation and Setup

### Prerequisites

- Python 3.10+
- Node.js 20+
- npm
- PostgreSQL
- PayPal Developer Sandbox account
- Groq API key

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/fairpay-ai.git
cd fairpay-ai
```

### 2. Backend Setup

```bash
cd backend

python -m venv venv
```

Activate the virtual environment.

**Windows:**
```bash
venv\Scripts\activate
```

**macOS / Linux:**
```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file inside the backend directory:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/fairpay

GROQ_API_KEY=your_groq_api_key

PAYPAL_CLIENT_ID=your_paypal_sandbox_client_id
PAYPAL_CLIENT_SECRET=your_paypal_sandbox_secret
PAYPAL_BASE_URL=https://api-m.sandbox.paypal.com
```

Replace the example values with your own credentials.

Start the backend:

```bash
uvicorn main:app --reload
```

Backend API documentation:

```text
http://127.0.0.1:8000/docs
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Start the frontend:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

*The commands above assume the corresponding files, scripts, and application modules have been created in the repository.*

---

## 📁 Project Structure

```text
fairpay-ai/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── main.py
│   ├── paypal_service.py
│   ├── ai_engine.py
│   ├── risk_engine.py
│   ├── database.py
│   ├── models.py
│   └── requirements.txt
│
├── data/
│   └── sample_transactions.json
│
├── docs/
│   └── architecture.md
│
├── .gitignore
├── .env.example
└── README.md
```

---

## 🧪 Testing

The application should be tested using PayPal Sandbox and synthetic customer/order data.

Suggested test scenarios:

1. Successful payment and capture.
2. Customer complaint submission.
3. AI complaint classification and summarization.
4. Risk indicator generation.
5. Merchant approval of a refund.
6. Refund amount validation.
7. Duplicate refund prevention.
8. Successful and failed refund responses.
9. Activity timeline updates.
10. Customer complaint status tracking.

Never use real customer payment information for public demonstrations.

---

## 🎯 Expected Impact

FairPay AI aims to:

- Reduce manual effort in complaint investigation.
- Help merchants understand payment-related issues.
- Improve consistency in resolution decisions.
- Make risk indicators easier to understand.
- Provide a transparent refund process.
- Improve communication between merchants and customers.

---

## 🔮 Future Enhancements

- Webhook-driven payment and refund status updates.
- Multilingual customer complaint analysis.
- Advanced dispute trend analytics.
- Merchant-specific resolution policies.
- More sophisticated evidence analysis.
- Integration with additional payment providers.
- Customer notification automation.

---

## ⚠️ Important Notes

- PayPal transaction APIs do not automatically provide delivery or logistics evidence. This information must be supplied by the merchant or an integrated external source.
- The risk assessment is an explainable decision-support indicator, not a calibrated chargeback probability or guarantee of fraud detection.
- An AI recommendation does not guarantee a dispute will be prevented.
- PayPal Sandbox is intended for testing and does not move real money.
- This is an independent project and is not an official PayPal product or endorsement.

---

## 👥 Team

**Project:** FairPay AI  
**Category:** FinTech | Artificial Intelligence | Payment Resolution

**Tagline:** Every Payment Deserves a Fair Resolution.



**Built with AI. Designed for Trust.** 💙
