# ☁️ Cloud-Native Serverless Voting Architecture

> **Yüksek Trafikli Senaryolar İçin Ölçeklenebilir, Güvenli ve Hibrit Veritabanlı Oylama Sistemi**

![AWS](https://img.shields.io/badge/AWS-Serverless-orange?style=for-the-badge&logo=amazon-aws)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![Python](https://img.shields.io/badge/Backend-Python-blue?style=for-the-badge&logo=python)
![Database](https://img.shields.io/badge/Polyglot-Persistence-green?style=for-the-badge)

---

## 📖 Proje Hakkında

Bu proje, modern bulut mimarileri kullanılarak geliştirilmiş, **Event-Driven (Olay Güdümlü)** ve **Serverless (Sunucusuz)** yapıda çalışan tam kapsamlı bir web uygulamasıdır. 

Geleneksel monolitik yapıların aksine; anlık trafik dalgalanmalarını (Spike Traffic) karşılayabilen, maliyet odaklı ve yüksek erişilebilirlik sağlayan bir **Mikroservis** mimarisi üzerine inşa edilmiştir. Projenin temel amacı, veri tutarlılığı (ACID) ile yüksek yazma hızı (High Write Throughput) gereksinimlerini **Polyglot Persistence** yaklaşımıyla aynı anda karşılamaktır.

---

## 🏗️ Mimari Tasarım

Sistem, sorumlulukların ayrılığı (SoC) prensibine göre tasarlanmış üç ana katmandan oluşur:

### 1. Frontend Katmanı (Client)
* **Teknoloji:** Next.js (App Router), TypeScript, Tailwind CSS
* **Görev:** Kullanıcı dostu arayüz, sonuçların görselleştirilmesi ve API iletişimi.
* **Deployment:** Vercel Edge Network üzerinde çalışarak düşük gecikme (Latency) sağlar.

### 2. Backend Katmanı (Compute)
* **Teknoloji:** AWS Lambda, Amazon API Gateway
* **Dil:** Python
* **Yapı:** Sunucusuz (Serverless). Trafik olmadığında uyku moduna geçer (0 Maliyet), trafik geldiğinde milisaniyeler içinde binlerce kopya oluşturarak ölçeklenir (Auto-scaling).

### 3. Veri Katmanı (Persistence) - *Polyglot Architecture*
Sistemde tek bir veritabanı yerine, verinin karakterine en uygun iki farklı veritabanı teknolojisi bir arada kullanılmıştır:

* **PostgreSQL (Relational):** Anket soruları, seçenekler ve yapısal veriler için. (ACID uyumluluğu için).
* **Amazon DynamoDB (NoSQL):** Oyların kaydedilmesi için. (Milyonlarca anlık yazma isteğini karşılayabilmek için).

---

## 🛠️ Kullanılan Teknolojiler

| Alan | Teknoloji | Kullanım Amacı |
| :--- | :--- | :--- |
| **Frontend** | Next.js 14, React | Server-Side Rendering (SSR) ve UI. |
| **Styling** | Tailwind CSS | Modern ve responsive tasarım. |
| **Backend** | AWS Lambda (Python) | İş mantığı (Business Logic). |
| **API** | AWS API Gateway | RESTful API yönetimi ve Routing. |
| **NoSQL DB** | Amazon DynamoDB | Yüksek hızlı oy kaydı (Vote Ingestion). |
| **SQL DB** | PostgreSQL (Supabase) | İlişkisel veri yönetimi. |
| **IaC** | AWS SAM | Altyapının kod olarak yönetilmesi (Infrastructure as Code). |
| **Security** | Custom Logic | IP tabanlı Rate Limiting ve Anti-Fraud. |

---

## 📡 API Uç Noktaları (Endpoints)

Sistem, dış dünya ile güvenli REST API üzerinden haberleşir:

* `GET /poll` → **Poll Service:** Aktif anketi ve seçenekleri PostgreSQL'den çeker.
* `POST /vote` → **Vote Service:** Kullanıcı oyunu ve IP adresini DynamoDB'ye işler. (Güvenlik kontrolü burada yapılır).
* `GET /results` → **Analytics Service:** DynamoDB'deki verileri tarayarak anlık sonuçları hesaplar.

---

## 🔥 Temel Özellikler

* ✅ **Sıfır Sunucu Yönetimi:** Tamamen Serverless yapı.
* ✅ **Hibrit Veritabanı:** SQL ve NoSQL'in en iyi yönlerinin birleşimi.
* ✅ **Güvenlik:** Mükerrer oy kullanımını engelleyen IP bazlı kontrol mekanizması.
* ✅ **Canlı Sonuçlar:** Oylama sonrası anlık güncellenen interaktif grafikler.
* ✅ **Responsive:** Mobil ve masaüstü uyumlu modern arayüz.

---

## 👨‍💻 Geliştirici Notu

> "Bu proje sadece bir oylama uygulaması değil; modern bulut mühendisliğinin, ölçeklenebilirliğin ve veritabanı optimizasyonunun canlı bir kanıtıdır."

---
