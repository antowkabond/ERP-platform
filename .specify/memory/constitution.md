# ERP System Specification

## Overview

This project aims to develop a modular, high-performance **ERP and Accounting platform** inspired by **1C:Enterprise architecture**, using **NestJS** and **PostgreSQL**.  
The system follows a **document-driven** approach where all business operations are represented as documents that post to **registers** and generate **accounting entries**.

The application must be designed for **simplicity, reusability, auditability, and performance**, ensuring all logic is centralized and easy to modify.

---

## 1. Architectural Principles

- Modular design: all logic grouped by domain (constants, directories, documents, registers, reports).
- Universal shared procedures for:
    - Stock retrieval
    - Register posting
    - Accounting entry generation
- High performance and scalability.
- Clear, easily extensible skeleton logic.
- Interface organized by **business area** (cash, inventory, payroll, etc.).
- Code must support **quick adjustments** and **minimal duplication**.

---

## 2. Core Components

### 2.1 Constants
- Store fixed configuration values that change infrequently.
- Data stored as **date–value pairs** (historical tracking).
- Editable via **Setup Wizard**, grouped by accounting sections:
    - General
    - Payroll
    - Warehouse
    - Settlements
- Accessible via the **Administration menu** or directly from related sections.

---

### 2.2 Directories (Catalogs)
- Hold reference information used throughout the system (e.g., counterparties, inventory items, employees).
- Prevent redundant data entry and serve as structured master data.
- Each directory:
    - Has a unique identifier (code or ID)
    - Supports hierarchical grouping (parent/child directories)
    - Provides list and form views
- **List view features:**
    - View by groups or full list
    - Filters and sorting (ascending/descending)
    - Create, edit, copy, delete
    - Field visibility customization
    - Printing support
- **Access points:**
    - Main directory menu
    - Contextual access from documents, registers, or reports

---

### 2.3 Documents
- Represent business transactions (sales, purchases, inventory movements, payroll, etc.).
- Contain metadata (date, number, author) and attributes (directory refs, enums, text, numbers).
- **Two states:**
    - *Saved* — record exists but does not affect registers.
    - *Posted* — updates registers and accounting.
- **Functionalities:**
    - Auto-generation from other documents (e.g., Invoice → Payment)
    - Access to subordinate/linked documents
    - Tabular sections with actions: add, delete, copy, sort, rearrange
    - Universal list view with filters, sorting, and printing
    - Visual indicators for status (posted, saved, deleted)
    - Print document forms for export or signature
- **Posting logic:** centralized via shared posting service.

---

### 2.4 Information Registers
- Store non-accounting or calculated data (e.g., prices, exchange rates).
- Date-based value history.
- Records may be entered manually or automatically from documents.
- Each record references its source document if applicable.
- **Features:**
    - Filters and visibility settings
    - Interval-based views
    - Create, edit, copy, delete (if manual)
    - Printable list view

---

### 2.5 Accumulation Registers
- Store and track quantitative and value indicators (balances, turnovers).
- Used for stock, cash, income, expense, or other movement tracking.
- Updated automatically when documents are posted/unposted.
- **Types:**
    - **Cumulative:** tracks inflows/outflows and balances
    - **Turnover:** tracks numeric changes only
- **Access:**
    - Through documents or the main menu (for advanced users)
- **Features:**
    - Filtering, sorting, field visibility
    - Interval selection
    - Printing
    - Manual entry (for authorized users)

---

### 2.6 Accounting Entries and Chart of Accounts
- Reflect business operations as **double-entry** records (debit-credit).
- Generated automatically upon document posting to accumulation registers.
- Not all documents produce accounting entries (e.g., HR-related actions).
- **Chart of Accounts:**
    - Auto-filled during initialization
    - Editable by advanced users
    - Supports analytics/sub-accounts (“subconto”)
- **Functionalities:**
    - Create, copy, edit, filter, print
    - Adjust accounts and analytics
    - Manual transaction entry via special document

---

### 2.7 Reports
- Two main types:
    1. **Management Reports** — based on accumulation and information registers.
    2. **Accounting Reports** — based on ledger (double-entry) data.
- **Unified structure and configuration:**
    - Filters, grouping, date intervals, drill-downs
    - Tabular and graphical outputs
    - Export to Excel, PDF, Word
- **Drill-down:** users can trace any value to its originating document.
- **Configurable defaults** per report type.
- Legislative and country-specific reports will be added later.

---

## 3. Interface and Usability

- **Navigation:** Tree structure or menu with submenus, organized by business areas:
    - Cash
    - Inventory Accounting
    - Payroll Accounting
    - Settlements, etc.
- **Universal List and Form Templates:**
    - Filters, quick search, sorting, and field customization
    - CRUD operations
    - Printing
- **Advanced User Mode:**
    - Access to all system objects and configuration settings
    - Quick search across modules

---

## 4. Performance and Scalability

- Optimize all queries and indexes for large datasets.
- Use caching for high-load modules.
- Ensure atomic posting operations.
- Support incremental updates and drill-downs without performance loss.

---

## 5. Development Guidelines

- **Code Organization**
    - Group related logic within modules:
        - `/modules/constants`
        - `/modules/catalogs`
        - `/modules/documents`
        - `/modules/registers`
        - `/modules/reports`
    - Use base abstract classes for all major object types:
        - `ConfigurationObject`
        - `Catalog`
        - `Document`
        - `Register`
        - `Report`

- **Shared Services**
    - `PostingService` for document posting/unposting
    - `StockService` for stock balance queries
    - `RegisterService` for register write/delete
    - `ReportBuilder` for generating report data

- **CQRS Architecture**
    - Commands and events for all major actions (`@CommandHandler`, `@EventsHandler`).
    - Example: `PostDocumentCommand`, `DocumentPostedEvent`.

- **Testing**
    - Use Jest for all modules.
    - Mock shared services for isolated unit tests.

---

## 6. Deliverables

1. **Core Framework**
    - Abstract base classes and shared services.
    - CQRS foundation and event handlers.

2. **Modules**
    - Constants
    - Directories (Catalogs)
    - Documents
    - Registers (Information & Accumulation)
    - Accounting (Entries, Chart of Accounts)
    - Reports

3. **API**
    - CRUD endpoints for all object types.
    - Document posting/unposting APIs.
    - Register query endpoints.
    - Report generation endpoints.

4. **UI/UX Layer**
    - Universal list & form components.
    - Setup wizard for constants.
    - Navigation tree by business area.

5. **Reports Engine**
    - Universal filter, grouping, and drill-down logic.
    - Export capabilities.

---

## 7. Non-Functional Requirements

- **Performance:** Optimized DB queries, caching for heavy modules.
- **Security:** Role-based access control and authentication via Auth0.
- **Monitoring:** Integration with Datadog (`dd-trace`).
- **Auditability:** Full traceability of changes and document sources.
- **Scalability:** Support for modular deployment and horizontal scaling.

---

## 8. Future Extensions

- File attachments for documents and directories.
- External service integrations (e.g., CRM, payment gateways).
- Advanced analytics dashboards.
- Localization and multi-language support.
- Versioning and audit logs for configuration objects.

---

**Author:** System Specification Draft  
**Version:** 1.0  
**Last Updated:** YYYY-MM-DD
