---
title: "Blog 1"
weight: 1
chapter: false
pre: " <b> 3.1. </b> "
---

## Autoscaling Kubernetes infrastructure on AWS with Karpenter and Amazon EKS

When running Kubernetes on AWS, a familiar challenge is: how do you make sure the cluster has enough nodes during traffic spikes, without paying for idle servers when traffic drops?

Traditionally, most Amazon EKS clusters relied on **Cluster Autoscaler** with **Auto Scaling Groups (ASG)**. This scales configured node groups, requiring the team to manage instance choices and Auto Scaling settings. Provisioning-time comparisons require measurements on comparable configurations.

**Karpenter** is an open-source node provisioning tool built by AWS, with stable v1 APIs introduced in version 1.0; select a currently supported release for deployment. Instead of scaling fixed groups of servers, Karpenter launches exactly the EC2 instance types that pending pods need, right when they need them.

So how does Karpenter work, and how is it different from the traditional approach?

---

### 1. Architecture Overview

Architecture diagram of node autoscaling with Karpenter on Amazon EKS:

![Karpenter v1.0 & Next-Gen Scaling on Amazon EKS](/images/3-BlogsPosted/blog2-karpenter-eks.png)

In this architecture, each component has a distinct role:

* **Amazon EKS:** AWS-managed Kubernetes, where applications run as pods.
* **Karpenter Controller:** Runs inside the cluster, watches for `Pending` pods and decides what kind of node to create and where.
* **NodePool:** Karpenter's policy configuration: allowed instance types, Spot or On-Demand, total CPU/RAM limits and how to clean up unneeded nodes.
* **EC2NodeClass:** The AWS infrastructure settings for nodes: subnets, security groups, AMI and IAM role.
* **Amazon EC2:** Provides the actual servers. Karpenter calls the EC2 Fleet API directly, without going through an Auto Scaling Group.

---

### 2. How the System Works

When traffic grows, Kubernetes creates more pods. If existing nodes do not have enough capacity, the new pods stay in the `Pending` state.

Karpenter detects these pods, aggregates their CPU, RAM and GPU requests along with constraints such as AZ or CPU architecture, and selects EC2 capacity according to NodePool constraints, Pod requirements and availability. It then calls the EC2 API directly. The new node joins the cluster and the pods are scheduled: with timing dependent on EC2 availability, AMI, bootstrap and networking; measure it in the target environment.

When traffic drops, Karpenter continuously checks whether pods can be packed onto fewer nodes or moved to smaller instances. If so, it moves the pods and terminates the extra nodes: a mechanism called **Consolidation** that significantly reduces EC2 costs.

---

### 3. Key Considerations When Deploying

**Always set resource limits on the NodePool**

Karpenter will happily create many nodes if many pods are pending, even when the cause is an application bug. Setting `limits` on total CPU and RAM constrains provisioning; these are not hard spending caps and concurrent scale-out can temporarily exceed limits.

**Configure Pod Disruption Budgets for critical apps**

Because Karpenter regularly cleans up and replaces nodes, critical applications need a Pod Disruption Budget (PDB) to limit voluntary disruption; PDBs do not protect against every failure or forceful disruption.

**Limit disruption during peak hours**

Karpenter supports scheduled Disruption Budgets, letting you constrain supported voluntary disruptions during critical windows such as events or sales campaigns.

Disruption budgets do not block every termination: interruptions, expiration and other forceful methods have separate rules.

**Watch subnet IP capacity**

Karpenter scales very fast and can exhaust IP addresses in small subnets. Use sufficiently large subnets or enable Prefix Delegation for the AWS VPC CNI.

**Take advantage of Spot Instances**

Allowing the NodePool to use many instance types makes it easier for Karpenter to find available Spot capacity, saving money while reducing the risk of capacity shortages.

---

### 4. When to Use Karpenter

**Karpenter is a good fit when:**

* Traffic fluctuates heavily and you need to scale fast
* The cluster runs mixed workloads (web, batch, AI/ML, GPU)
* You want to cut EC2 costs with Spot Instances and Consolidation
* You do not want to maintain many separate Node Groups

**Cluster Autoscaler is still enough when:**

* The cluster is small with steady, predictable load
* The system depends heavily on existing Auto Scaling Groups

---

### 5. Summary

Karpenter changes how Kubernetes infrastructure scales on AWS: instead of applications fitting into pre-configured groups of servers, infrastructure is created to match what the applications actually need.

With fast provisioning, flexible instance selection and automatic cleanup of unneeded nodes, Karpenter is well worth considering for Amazon EKS clusters that need to scale quickly while keeping costs under control on AWS Cloud.

---

**References**

* Karpenter Documentation: [https://karpenter.sh/docs/](https://karpenter.sh/docs/)
* Amazon EKS Best Practices - Karpenter: [https://docs.aws.amazon.com/eks/latest/best-practices/karpenter.html](https://docs.aws.amazon.com/eks/latest/best-practices/karpenter.html)
* Announcing Karpenter 1.0 - AWS Blog: [https://aws.amazon.com/blogs/containers/announcing-karpenter-1-0/](https://aws.amazon.com/blogs/containers/announcing-karpenter-1-0/)

---

*#AWS #AmazonEKS #Karpenter #Kubernetes #Autoscaling #CostOptimization #AWSStudyGroup*

---

### Publication evidence

The article about Karpenter and Amazon EKS shared in the AWS Study Group VN community.

![The article about Karpenter and Amazon EKS shared in the AWS Study Group VN community.](/images/3-BlogsPosted/evidence/blog1-karpenter-published.png)
