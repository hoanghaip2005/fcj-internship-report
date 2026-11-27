---
title: "Blog 2"
weight: 2
chapter: false
pre: " <b> 3.2. </b> "
---

## High-performance storage on AWS with Amazon S3 Express One Zone

Amazon S3 has long been the standard for object storage on AWS, with 99.999999999% durability. However, for systems that require frequent, high-throughput data access: such as AI/ML model training, real-time data processing, or interactive analytics: S3 Standard access latency can become a bottleneck, depending on the workload.

**Amazon S3 Express One Zone** is a high-performance storage class designed to address this problem. Rather than storing data across multiple Availability Zones, it focuses on speed by allowing data to be co-located in the same Availability Zone as compute resources, reducing latency to single-digit milliseconds.

So how does S3 Express One Zone work, and which workloads does it suit best?

---

### 1. Architecture Overview

Architecture diagram for high-performance storage with Amazon S3 Express One Zone:

![Amazon S3 Express One Zone Architecture](/images/3-BlogsPosted/blog3-s3-express.png)

Each component plays a distinct role in this architecture:

* **Amazon S3 Express One Zone (Directory Bucket):** The primary storage layer for "hot" data. Uses a special bucket type called Directory Bucket with a directory-oriented namespace; it remains object storage rather than a POSIX filesystem, optimized for continuous high-frequency read/write operations.
* **Amazon EC2 / EKS / SageMaker (same AZ):** Compute resources placed in the same Availability Zone as the Directory Bucket. This co-location is the core mechanism that eliminates inter-AZ network latency.
* **Amazon Athena / Apache Spark / EMR:** Query engines and analytics frameworks that access S3 Express One Zone directly to benefit from significantly faster data reads compared to S3 Standard.
* **Amazon S3 Standard:** The source-data and results storage layer in this design for source data, final outputs, and infrequently accessed files. Used alongside S3 Express One Zone in a Two-Tier Storage model.
* **AWS IAM / Session Credentials:** S3 Express One Zone uses a session-based authentication mechanism (`CreateSession`), providing temporary credentials for data operations; requests still require SigV4 signing.

---

### 2. How the System Works

The core difference of S3 Express One Zone lies in how data is stored and accessed.

When an AI training job or analytics pipeline starts, the compute resource (EC2, EKS node, SageMaker instance) calls the `CreateSession` API to obtain a short-lived session token. Subsequent read/write requests still use SigV4 signing with the session credentials. Supported AWS SDKs obtain and refresh sessions automatically.

Data is retrieved directly from a dedicated hardware cluster placed in the same Availability Zone as the compute resources. This co-location avoids an inter-AZ access path when compute and storage share an AZ, supporting single-digit millisecond latency. Actual results depend on object size, concurrency and workload; these latency ranges are not an SLA.

When the job finishes, final results or checkpoints are moved to S3 Standard for cost-effective long-term storage.

---

### 3. Key Considerations When Deploying

**Directory Buckets and naming conventions**

S3 Express One Zone uses a distinct bucket type called a Directory Bucket, which is fundamentally different from General Purpose Buckets. Bucket names must include an Availability Zone suffix: for example: `my-data--use1-az4--x-s3`. The bucket is tied to a specific AZ at creation time and cannot be changed afterward.

**Data exists in a single AZ only**

Unlike S3 Standard, which stores data across multiple AZs to achieve 11-nine durability, S3 Express One Zone stores data in a single AZ. S3 Express One Zone is also designed for 99.999999999% durability, but does not tolerate the loss of an entire AZ: data can be lost, not merely become temporarily inaccessible. This storage class should only be used for temporary or reproducible data: not as a primary store for critical, irreplaceable data.

**Higher storage cost, lower request cost**

Pricing depends on Region, date and request type. Check current S3 pricing and account for storage, requests, retrieval and data transfer rather than treating launch prices as current prices. This pricing model is well-suited for workloads with frequent read/write operations that don't require long-term retention.

**Compute must be in the same AZ**

To achieve the lowest possible latency, EC2 instances, EKS nodes, or SageMaker notebooks must reside in the same Availability Zone as the Directory Bucket. Cross-AZ access is possible, but additional network latency and inter-AZ transfer costs should be measured.

---

### 4. When to Use S3 Express One Zone

**Use S3 Express One Zone for:**

* AI/ML training and model checkpoints
* Real-time interactive analytics data
* ETL intermediate data and shuffle data

**Use S3 Standard for:**

* Frequently accessed data, source copies and suitable backups; choose S3 Glacier classes separately for archive requirements
* Static website assets and user uploads
* Data that requires multi-AZ high availability

---

### 5. Summary

Amazon S3 Express One Zone is not a replacement for S3 Standard: it is a complement that solves a specific problem S3 Standard is not optimized for: high-throughput, low-latency access for frequently accessed "hot" data.

The Two-Tier Storage model combining S3 Express One Zone (hot tier) and S3 Standard (source data and results) is a common pattern in AI/ML and data analytics systems on AWS: leveraging the speed of S3 Express One Zone during active processing while controlling costs by transitioning data to S3 Standard after completion.

This is a service worth exploring when building high-performance data pipelines or AI/ML workloads on AWS Cloud.

---

**References**

* Amazon S3 Express One Zone - AWS Documentation: [https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-express-one-zone.html](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-express-one-zone.html)
* S3 Express One Zone Performance - AWS Blog: [https://aws.amazon.com/blogs/aws/new-amazon-s3-express-one-zone-high-performance-storage-class/](https://aws.amazon.com/blogs/aws/new-amazon-s3-express-one-zone-high-performance-storage-class/)
* Directory Buckets - AWS S3 User Guide: [https://docs.aws.amazon.com/AmazonS3/latest/userguide/directory-buckets-overview.html](https://docs.aws.amazon.com/AmazonS3/latest/userguide/directory-buckets-overview.html)

---

*#AWS #S3 #S3ExpressOneZone #AIML #DataEngineering #CloudStorage #AWSStudyGroup*

---

### Publication evidence

The article about Amazon S3 Express One Zone shared in the AWS Study Group VN community.

![The article about Amazon S3 Express One Zone shared in the AWS Study Group VN community.](/images/3-BlogsPosted/evidence/blog2-s3-express-published.png)
