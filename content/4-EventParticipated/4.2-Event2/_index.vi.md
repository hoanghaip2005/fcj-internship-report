---
title: "Event 2"
date: 2026-09-29
weight: 2
chapter: false
pre: " <b> 4.2. </b> "
---

## Bài thu hoạch AWS Cloud and AI Day Hanoi

### 1. Thông tin sự kiện

- **Ngày tổ chức:** 29/09/2026.
- **Thời gian chương trình:** 07:30–17:00, giờ Việt Nam; keynote bắt đầu lúc 09:00.
- **Địa điểm tổ chức chính:** JW Marriott Hotel Hanoi.
- **Đơn vị tổ chức:** Amazon Web Services (AWS).
- **Hình thức:** Hội thảo trực tiếp, các phiên chuyên đề, workshop và khu triển lãm công nghệ.

Chương trình có nhiều phiên song song và một mục HCMC Watch Party trong agenda. Ảnh thẻ xác nhận tên chương trình; bài không suy ra địa điểm tham dự cá nhân hoặc những phiên đã hoàn thành chỉ từ ảnh thẻ.

### 2. Mục tiêu học tập

Trong thời gian thực tập, em quan tâm đến cách sử dụng AWS để xây dựng ứng dụng, tổ chức dữ liệu và vận hành hệ thống. AWS Cloud and AI Day Hanoi là dịp để em hệ thống hóa những hướng phát triển này, đặc biệt là mối liên hệ giữa AI Agent, nền tảng dữ liệu, hiện đại hóa ứng dụng và công cụ hỗ trợ lập trình.

Mục tiêu học tập của em là hiểu bài toán đứng sau từng công nghệ, nhận diện điều kiện triển khai và lựa chọn nội dung phù hợp với năng lực hiện tại. Thay vì chỉ ghi nhớ tên dịch vụ, em tập trung vào cách dữ liệu đi qua hệ thống, ai được sử dụng dữ liệu và làm thế nào để kiểm tra kết quả.

### 3. Nội dung chương trình và kiến thức tiếp thu

#### 3.1. Keynote: từ ý tưởng đến giải pháp có thể triển khai

Keynote **What does it take to solve problems everyone says are impossible? KEY001** được xếp lúc 09:00. Nội dung giới thiệu của chương trình nhấn mạnh việc hỗ trợ người xây dựng ứng dụng biến ý tưởng thành giải pháp, sử dụng các hệ thống agentic để phát triển phần mềm, hiện đại hóa workload và bảo vệ tổ chức.

Từ chủ đề này, em rút ra rằng AI cần được đặt trong một mục tiêu sử dụng cụ thể. Một tính năng hữu ích phải giải quyết được khó khăn của người dùng, có dữ liệu phù hợp và có cách đánh giá. Với sinh viên thực tập, hướng tiếp cận khả thi là chọn một luồng nhỏ, hoàn thiện từng bước và giải thích được các quyết định kỹ thuật.

#### 3.2. AI Agent: khoảng cách giữa demo và triển khai

Agenda có phiên **From Demo to Deployment: Solving Agentic AI's Toughest Challenges AIM201**, với đơn vị diễn giả được liệt kê là **Katalon, AWS**. Phiên được xếp lúc 11:00 tại Grand Ballroom 1, cùng khung giờ với một số chuyên đề khác.

Chủ đề giúp em đặt ra những câu hỏi cần thiết khi nghiên cứu agent: dữ liệu có đúng không, công cụ được cấp quyền gì, hệ thống xử lý lỗi như thế nào và chi phí của một lượt thực hiện là bao nhiêu? Đây là những vấn đề cần giải quyết trước khi cho agent phục vụ người dùng thật hoặc thay đổi dữ liệu.

Về hướng vận dụng, em phân biệt việc tạo câu trả lời với việc thực thi hành động. Một agent thông báo đã cập nhật thông tin phải dựa vào kết quả API; ứng dụng vẫn cần kiểm tra danh tính, quyền và tham số. Phần diễn giải của mô hình cần được kết hợp với các hàm xử lý có thể kiểm thử.

#### 3.3. Nền tảng dữ liệu cho AI

Phiên **Build an AI-ready data foundation ANT202**, do **AWS** giới thiệu, được xếp lúc 11:00 tại phòng Ho Tay. Nội dung này liên hệ trực tiếp với việc chuẩn bị dữ liệu trước khi xây dựng các chức năng hỏi đáp hoặc hỗ trợ ra quyết định.

Bài học em hệ thống hóa là dữ liệu phục vụ AI cần có cấu trúc, ý nghĩa và phạm vi sử dụng rõ ràng. Với tài liệu, cần biết tên, phiên bản, thời điểm cập nhật và người được phép đọc. Với chỉ số, cần thống nhất cách tính và đơn vị đo. Nếu dữ liệu thiếu ngữ cảnh, câu trả lời có thể diễn đạt trôi chảy nhưng không phù hợp với nghiệp vụ.

Trong một thử nghiệm RAG, em sẽ kiểm tra hai bước riêng: hệ thống có lấy được đúng tài liệu không, và câu trả lời có bám vào tài liệu đó không. Khi kết quả sai, cách kiểm tra này giúp xác định cần sửa dữ liệu, bước tìm kiếm hay chỉ dẫn cho mô hình.

#### 3.4. Phát triển phần mềm và nền tảng cho đội ngũ kỹ thuật

Nhóm phiên về phát triển ứng dụng gồm **Building software like never before with agentic AI DVT203** của AWS và **Platform Engineering at Scale: Internal Developer Platform on EKS DEV205**, với đơn vị diễn giả **VPBank**. Agenda cũng có phiên **Don't use a Ferrari to Get Phở DEV303**, với đơn vị diễn giả **Cloud Kinetics**. Tên phiên cuối gợi ra câu hỏi về lựa chọn công cụ phù hợp; bài không suy diễn giải pháp hoặc kết luận cụ thể khi chưa có nội dung trình bày chi tiết.

Từ nhóm chủ đề này, em nhận thấy năng suất phát triển không chỉ đến từ việc sinh mã nhanh. Nhóm còn cần môi trường nhất quán, cấu hình có thể tái tạo, quy trình kiểm thử và cách triển khai dễ theo dõi. Khi công cụ AI tham gia viết mã, yêu cầu rõ ràng và kiểm tra kết quả vẫn là trách nhiệm của người phát triển.

Đối với EKS, em xem đây là hướng tìm hiểu tiếp theo sau khi nắm vững container, mạng và phân quyền. Việc chọn nền tảng cần dựa trên nhu cầu vận hành và khả năng quản lý của nhóm, tránh bổ sung thành phần phức tạp khi bài toán chưa yêu cầu.

#### 3.5. Di chuyển và hiện đại hóa workload

Phiên **Migration at Scale with Agentic AI: AWS Transform and Beyond AIM302** được xếp lúc 11:00 tại Grand Ballroom 2, với đơn vị diễn giả **AWS**. Chủ đề cho thấy AI còn được áp dụng vào vòng đời hệ thống, bên cạnh các ứng dụng chatbot hoặc trợ lý.

Điều em cần tiếp tục học là phân biệt chuyển môi trường chạy với thay đổi kiến trúc ứng dụng. Trước khi thực hiện, cần liệt kê thành phần, xác định phụ thuộc, chuẩn bị kiểm thử và cách khôi phục. Công cụ hỗ trợ có thể giảm công việc lặp lại, nhưng kết quả cấu hình hoặc mã chuyển đổi vẫn cần được rà soát trong bối cảnh hệ thống cụ thể.

#### 3.6. Khu trải nghiệm và kết nối cộng đồng

Chương trình giới thiệu **Expo, Startup Zone, Developer Community Zone, Workshops** và hoạt động **8-Bit Agents Activation**. Session catalogue còn có **Amazon Quick Play & Build: Create Your AI Assistant, Compete, Win AIM103**, do AWS giới thiệu.

Các hoạt động này thể hiện cách kết hợp học chuyên đề với quan sát sản phẩm và thực hành. Đối với em, cách học phù hợp là ghi lại bài toán của từng demo, các thành phần chính và câu hỏi còn chưa hiểu, sau đó chọn một phần để thực hiện lại. Bài thu hoạch không ghi nhận giải thưởng, sản phẩm workshop hoặc kết quả triển khai cá nhân chưa được xác nhận.

### 4. Bài học đối với bản thân

**Bắt đầu từ nền tảng.** Những chủ đề AI, dữ liệu, EKS và migration đều cần kiến thức về mạng, danh tính, lưu trữ và vận hành. Em cần tiếp tục học AWS theo luồng ứng dụng, giải thích được vai trò của từng thành phần trước khi tích hợp thêm công nghệ.

**Học theo bài toán có thể kiểm tra.** Một bản thử nghiệm cần có đầu vào, đầu ra mong đợi và tình huống lỗi. Khi đánh giá một trợ lý, em cần xem cả tính đúng, khả năng dẫn chứng, quyền truy cập và thời gian phản hồi.

**Chọn công cụ theo nhu cầu.** Giải pháp phù hợp phải cân bằng lợi ích, chi phí và công sức vận hành. Với dự án nhỏ, cần ưu tiên một luồng đơn giản, ổn định và dễ giải thích trước khi mở rộng kiến trúc.

### 5. Hướng áp dụng trong thực tập

| Phạm vi | Công việc đề xuất | Tiêu chí kiểm tra |
|---|---|---|
| Bài lab AWS | Vẽ luồng truy cập, ghi lại quyền và cấu hình | Giải thích được cách ứng dụng sử dụng tài nguyên |
| DropIt | Chuẩn hóa metadata và quyền tài liệu; nghiên cứu tra cứu chỉ đọc | Đúng nguồn, đúng phiên bản, đúng phạm vi chia sẻ |
| FitJoy | Áp dụng yêu cầu rõ ràng và kiểm thử khi dùng AI hỗ trợ viết mã | Đáp ứng hành vi đã thống nhất; chưa phải triển khai AWS |
| Thử nghiệm AI | Chuẩn bị câu hỏi có đáp án, thiếu dữ liệu và ngoài phạm vi | Phát hiện câu trả lời sai hoặc tự thêm thông tin |
| Tài liệu học tập | Ghi quyết định kỹ thuật, giới hạn và kết quả kiểm tra | Có thể thực hiện lại các bước chính |

Đây là định hướng sau khi tổng hợp chương trình, chưa phải các hạng mục đã hoàn thành. Em ưu tiên một chức năng nhỏ và đo được để củng cố kiến thức trước khi mở rộng.

### 6. Kết luận

AWS Cloud and AI Day Hanoi giúp em hình thành góc nhìn liên kết giữa phát triển ứng dụng, dữ liệu và hạ tầng Cloud. Bài học quan trọng đối với em là đưa công nghệ vào một quy trình có yêu cầu rõ, kiểm soát quyền và kiểm chứng kết quả. Hướng học tiếp theo là củng cố AWS căn bản, thực hiện thử nghiệm có phạm vi phù hợp và ghi chép đầy đủ quá trình đánh giá.

### Hình ảnh minh chứng

![Thẻ tham dự AWS Cloud and AI Day Hanoi](/images/4-EventParticipated/event2/evidence-02.jpg)

*Thẻ tham dự có tên AWS Cloud and AI Day Hanoi.*

![Ảnh chụp cùng các bạn tại AWS Cloud and AI Day](/images/4-EventParticipated/event2/group-photo.jpg)

*Ảnh chụp cùng các bạn tham dự AWS Cloud and AI Day.*
