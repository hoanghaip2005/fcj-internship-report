---
title: "Blog 1"
weight: 1
chapter: false
pre: " <b> 3.1. </b> "
---

## Tự động mở rộng hạ tầng Kubernetes trên AWS với Karpenter và Amazon EKS

Khi vận hành Kubernetes trên AWS, một bài toán quen thuộc là: làm sao để cluster có đủ máy chủ khi lưu lượng tăng đột biến, nhưng không phải trả tiền cho những máy chủ chạy không tải khi lưu lượng giảm?

Trước đây, hầu hết các cụm Amazon EKS dùng **Cluster Autoscaler** kết hợp **Auto Scaling Groups (ASG)**. Cách này mở rộng theo các nhóm node đã cấu hình; nhóm vận hành cần quản lý lựa chọn instance và tham số Auto Scaling. So sánh thời gian cấp node cần đo trên cấu hình tương đương.

**Karpenter** là công cụ tự động cấp phát node mã nguồn mở do AWS phát triển, có API ổn định v1 từ phiên bản 1.0; cần chọn bản phát hành đang được hỗ trợ khi triển khai. Thay vì mở rộng theo từng nhóm máy chủ cố định, Karpenter tạo đúng loại EC2 instance phù hợp với nhu cầu của các pod đang chờ, ngay tại thời điểm cần.

Vậy Karpenter hoạt động như thế nào và khác gì so với cách làm truyền thống?

---

### 1. Tổng quan các thành phần trong kiến trúc

Sơ đồ kiến trúc tự động mở rộng node với Karpenter trên Amazon EKS:

![Karpenter v1.0 & Next-Gen Scaling on Amazon EKS](/images/3-BlogsPosted/blog2-karpenter-eks.png)

Trong kiến trúc này, mỗi thành phần đảm nhận một vai trò riêng:

* **Amazon EKS:** Dịch vụ Kubernetes được quản lý bởi AWS, nơi chạy các ứng dụng dưới dạng pod.
* **Karpenter Controller:** Chạy bên trong cluster, theo dõi các pod ở trạng thái `Pending` và quyết định cần tạo thêm node loại gì, ở đâu.
* **NodePool:** Cấu hình chính sách của Karpenter: được phép dùng loại instance nào, Spot hay On-Demand, giới hạn tổng CPU/RAM và cách dọn dẹp node dư thừa.
* **EC2NodeClass:** Cấu hình phần hạ tầng AWS cho node: subnet, security group, AMI và IAM role.
* **Amazon EC2:** Cung cấp máy chủ thực tế. Karpenter gọi trực tiếp EC2 Fleet API để tạo instance mà không cần qua Auto Scaling Group.

---

### 2. Luồng hoạt động của hệ thống

Khi lưu lượng tăng, Kubernetes tạo thêm pod. Nếu các node hiện có không còn đủ tài nguyên, những pod mới sẽ rơi vào trạng thái `Pending`.

Karpenter phát hiện các pod này, tổng hợp yêu cầu CPU, RAM, GPU và các ràng buộc như AZ hay kiến trúc chip của chúng, rồi lựa chọn EC2 instance theo ràng buộc NodePool, nhu cầu Pod và khả năng cung ứng. Sau đó Karpenter gọi trực tiếp EC2 API để tạo instance. Node mới tham gia cluster và các pod được xếp lịch chạy, với thời gian phụ thuộc khả năng cung ứng EC2, AMI, bootstrap và mạng; cần đo trong môi trường thực tế.

Khi lưu lượng giảm, Karpenter liên tục kiểm tra xem có thể dồn các pod về ít node hơn hoặc thay bằng instance nhỏ hơn không. Nếu có, Karpenter sẽ di chuyển pod và tắt các node dư thừa cơ chế này gọi là **Consolidation**, giúp giảm đáng kể chi phí EC2.

---

### 3. Những điểm cần chú ý khi triển khai

**Luôn đặt giới hạn tài nguyên trong NodePool**

Karpenter sẵn sàng tạo rất nhiều node nếu có quá nhiều pod đang chờ, kể cả khi nguyên nhân là lỗi ứng dụng. Đặt `limits` cho tổng CPU và RAM giúp giới hạn phạm vi cấp phát; đây không phải mức trần chi phí cứng và có thể vượt tạm thời khi mở rộng đồng thời.

**Cấu hình Pod Disruption Budget cho ứng dụng quan trọng**

Vì Karpenter thường xuyên dọn dẹp và thay thế node, các ứng dụng quan trọng cần có Pod Disruption Budget (PDB) để giới hạn gián đoạn tự nguyện theo cấu hình; PDB không bảo vệ khỏi mọi loại lỗi hoặc gián đoạn bắt buộc.

**Hạn chế gián đoạn vào giờ cao điểm**

Karpenter hỗ trợ Disruption Budgets theo lịch, cho phép giới hạn các gián đoạn tự nguyện được hỗ trợ trong những khung giờ quan trọng, ví dụ thời gian diễn ra sự kiện hoặc khuyến mãi.

Disruption Budget không chặn mọi lần tắt node: interruption, expiration và các phương thức bắt buộc có quy tắc riêng.

**Chú ý số lượng IP trong subnet**

Karpenter mở rộng rất nhanh nên có thể làm cạn dải IP nếu subnet quá nhỏ. Nên dùng subnet đủ lớn hoặc bật Prefix Delegation cho AWS VPC CNI.

**Tận dụng Spot Instance**

Cho phép NodePool dùng nhiều loại instance khác nhau giúp Karpenter dễ tìm được Spot Instance còn trống, tiết kiệm chi phí mà vẫn hạn chế bị thiếu công suất.

---

### 4. Khi nào nên dùng Karpenter?

**Karpenter phù hợp khi:**

* Lưu lượng biến động mạnh, cần mở rộng nhanh
* Cluster chạy nhiều loại workload khác nhau (web, batch, AI/ML, GPU)
* Muốn giảm chi phí EC2 bằng Spot Instance và Consolidation
* Không muốn duy trì nhiều Node Group riêng lẻ

**Cluster Autoscaler vẫn đủ dùng khi:**

* Cluster nhỏ, tải ổn định, ít thay đổi
* Hệ thống đang phụ thuộc chặt vào Auto Scaling Group có sẵn

---

### 5. Tổng kết

Qua kiến trúc này, có thể thấy Karpenter thay đổi cách mở rộng hạ tầng Kubernetes trên AWS: thay vì ứng dụng phải chạy theo các nhóm máy chủ cấu hình sẵn, hạ tầng được tạo ra theo đúng nhu cầu thực tế của ứng dụng.

Với tốc độ cấp phát nhanh, khả năng chọn instance linh hoạt và cơ chế tự dọn dẹp node dư thừa, Karpenter là lựa chọn đáng cân nhắc cho các cụm Amazon EKS cần vừa mở rộng nhanh vừa tối ưu chi phí trên AWS Cloud.

---

**Tài liệu tham khảo**

* Karpenter Documentation: [https://karpenter.sh/docs/](https://karpenter.sh/docs/)
* Amazon EKS Best Practices Karpenter: [https://docs.aws.amazon.com/eks/latest/best-practices/karpenter.html](https://docs.aws.amazon.com/eks/latest/best-practices/karpenter.html)
* Announcing Karpenter 1.0 AWS Blog: [https://aws.amazon.com/blogs/containers/announcing-karpenter-1-0/](https://aws.amazon.com/blogs/containers/announcing-karpenter-1-0/)

---

*#AWS #AmazonEKS #Karpenter #Kubernetes #Autoscaling #CostOptimization #AWSStudyGroup*

---

### Minh chứng bài viết đã đăng

Bài viết về Karpenter và Amazon EKS được chia sẻ trong nhóm AWS Study Group VN.

![Bài viết về Karpenter và Amazon EKS được chia sẻ trong nhóm AWS Study Group VN.](/images/3-BlogsPosted/evidence/blog1-karpenter-published.png)
