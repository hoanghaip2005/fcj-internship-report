---
title: "Event 3"
date: 2026-10-08
weight: 3
chapter: false
pre: " <b> 4.3. </b> "
---

## Bài thu hoạch sự kiện AWS for Software & Financial Services Companies Day

### 1. Thông tin chung

- **Thời gian:** 08/10/2026, 09:00–18:00, giờ Việt Nam.
- **Địa điểm:** Sheraton Saigon Grand Opera Hotel, TP. Hồ Chí Minh.
- **Đơn vị tổ chức:** Amazon Web Services (AWS).
- **Hình thức:** Hội thảo chuyên đề và workshop thực hành; nội dung được trình bày bằng tiếng Việt.

Tên trên Luma là **AWS for Software & Financial Services Companies Day**; bộ slide sử dụng tên **AWS for Software and Technology Companies Day**. Bài thu hoạch dùng tên trên trang đăng ký, đồng thời giữ nguyên tên các chuyên đề trong tài liệu.

### 2. Mục tiêu học tập

Trong giai đoạn thực tập AWS, em muốn hiểu cách những kiến thức về hạ tầng, dữ liệu và bảo mật được kết nối thành một giải pháp thực tế. Sự kiện giúp em tiếp cận vấn đề này qua ba nhóm nội dung: đưa AI Agent từ bản thử nghiệm vào vận hành, chuẩn bị dữ liệu đủ chất lượng cho agent và sử dụng AI để hỗ trợ di chuyển, hiện đại hóa ứng dụng.

Mục tiêu của em là nhận diện được những yêu cầu thường chưa thể hiện trong một bản demo: quyền truy cập, tính đúng của dữ liệu, khả năng theo dõi lỗi, chi phí và cách kiểm tra kết quả. Từ đó, em có thể lựa chọn phần kiến thức phù hợp để nghiên cứu trong bài lab và các dự án cá nhân.

### 3. Nội dung tiếp thu từ chương trình

#### 3.1. Đưa AI Agent từ demo đến vận hành thực tế

Chuyên đề **From Demo to Deployment: Solving Agentic AI's Toughest Challenges**, do **Dzung Ha, Solutions Architect, AWS** trình bày, đặt ra câu hỏi: một agent trả lời được trong môi trường thử nghiệm đã đủ điều kiện phục vụ người dùng thật hay chưa? Bộ slide phân tích bốn nhóm yêu cầu: vận hành, dữ liệu và ngữ cảnh, độ tin cậy, niềm tin và bảo mật.

Về **vận hành**, hệ thống cần theo dõi được chuỗi xử lý thay vì chỉ ghi nhận câu trả lời cuối cùng. Nếu agent phản hồi chậm, cần xác định thời gian nằm ở bước gọi mô hình, truy xuất dữ liệu hay sử dụng công cụ. Chi phí, độ trễ và độ chính xác cũng phải được xem xét cùng nhau; lựa chọn mô hình cần xuất phát từ yêu cầu của từng tác vụ.

Về **dữ liệu và ngữ cảnh**, slide chỉ ra ảnh hưởng của cách chia đoạn tài liệu, embedding, xếp hạng kết quả và độ cập nhật của chỉ mục đến chất lượng RAG. Bộ nhớ ngắn hạn giữ ngữ cảnh phiên hiện tại; bộ nhớ dài hạn phục vụ những thông tin cần duy trì qua nhiều phiên. Việc lưu nhớ phải đi kèm phân tách theo người dùng, tránh sử dụng nhầm dữ liệu giữa các phiên.

Điểm em thấy thiết thực nhất là nguyên tắc **dùng code cho phần việc có quy tắc xác định**. Tính toán, kiểm tra điều kiện và xác thực dữ liệu nên được thực hiện bằng hàm có thể kiểm thử; agent đảm nhận phần diễn giải và điều phối khi cần suy luận. Cách phân chia này giúp tránh việc giao cả phép tính hoặc quyết định phân quyền cho mô hình ngôn ngữ.

Từ chuyên đề, em rút ra rằng “chạy được” mới là bước đầu. Một giải pháp cần có bộ câu hỏi kiểm thử, theo dõi sau triển khai và cách khôi phục khi chất lượng suy giảm. Các yêu cầu về danh tính, cô lập phiên, chính sách trước khi thực thi và guardrails cần được thiết kế cùng luồng xử lý.

#### 3.2. Dữ liệu sẵn sàng cho AI cần có ý nghĩa và trách nhiệm rõ ràng

Trong chuyên đề **Building High-Quality Data Products for AI Agents**, **Binh Tran, Senior Solutions Architect, AWS** trình bày năm thuộc tính của dữ liệu phục vụ agent: **đáng tin cậy, có ngữ cảnh, truy vết được, được quản trị và có thể phục vụ hành động**.

Ví dụ về chỉ số chi tiêu trong slide giúp em hiểu rõ vấn đề: nếu pipeline cộng các giao dịch đã thanh toán nhưng bỏ qua hoàn tiền và giao dịch đảo, số tổng vẫn có thể trông hợp lệ. Agent sử dụng con số đó để đề xuất tăng hạn mức sẽ biến lỗi dữ liệu thành một hành động nghiệp vụ. Vì vậy, kiểm tra ở bước trả lời là chưa đủ; cần chặn lỗi tại nguồn và trong pipeline.

**Data contract** được giới thiệu như một thỏa thuận cụ thể về dữ liệu: ai chịu trách nhiệm, cấu trúc trường, cách tính chỉ số, quy tắc chất lượng, độ cập nhật, phiên bản và quyền truy cập. Trong ví dụ, `net_spend` phải được định nghĩa rõ là giá trị thanh toán trừ hoàn tiền và giao dịch đảo. Khi ý nghĩa được thể hiện trong dữ liệu và catalog, các thành phần sử dụng mới có cơ sở diễn giải thống nhất.

Một điểm khác là phân biệt **dữ liệu gần nghĩa** với **dữ liệu có quan hệ cần thiết để trả lời**. Phần so sánh vector search và graph trong slide cho thấy câu trả lời về triển vọng bán hàng có thể cần liên hệ cả nhu cầu thị trường và sự cố vận chuyển. Điều này giúp em hiểu rằng tăng số đoạn truy xuất chưa chắc giải quyết được việc thiếu quan hệ nghiệp vụ hoặc định nghĩa chỉ số.

Với trường hợp agent được phép ghi vào hệ thống, tài liệu nêu năm chốt kiểm soát: công cụ có phạm vi hẹp, giới hạn được kiểm tra ngoài mô hình, phê duyệt của con người cho hành động tác động lớn, khả năng thử lại không tạo thay đổi trùng và truy vết từng lần ghi. Ví dụ mức tăng 15% trong slide là minh họa nghiệp vụ, cần được thay bằng quy tắc phù hợp khi áp dụng vào một hệ thống khác.

Bài học em rút ra là cần xem dữ liệu như một sản phẩm có người chịu trách nhiệm và tiêu chí chất lượng. Trước khi bổ sung AI, phải trả lời được dữ liệu đến từ đâu, có còn hiệu lực không, ai được xem và có thể giải thích quyết định dựa trên dữ liệu đó hay không.

#### 3.3. Di chuyển và hiện đại hóa cần kế hoạch, kiểm chứng và phê duyệt

Chuyên đề **Migration at scale with agentic AI: AWS Transform and beyond**, do **Taiki Dang, Solutions Architect, Migration & Modernize | Security, AWS** trình bày, mô tả cách kết hợp AWS Transform, Kiro và Amazon Bedrock AgentCore trong quá trình di chuyển hệ thống.

Nội dung giúp em phân biệt các lựa chọn như đưa máy chủ lên EC2, chuyển ứng dụng sang container hoặc tái cấu trúc để sử dụng dịch vụ được quản lý. Mỗi lựa chọn có mức thay đổi và yêu cầu kiểm thử khác nhau. Việc di chuyển vì thế không chỉ là sao chép máy chủ: còn có khảo sát phụ thuộc, đánh giá chi phí, chuẩn bị môi trường đích, chuyển đổi cấu hình mạng, chạy thử và lập kế hoạch chuyển vận hành.

Trong cách tiếp cận được trình bày, **AWS Transform** hỗ trợ các luồng đánh giá và chuyển đổi; **Kiro** cung cấp giao diện làm việc bằng hội thoại và kết nối công cụ qua MCP; các agent trên **AgentCore** có thể hỗ trợ phần điều phối như tạo yêu cầu thay đổi, kiểm tra mốc di chuyển hoặc cập nhật trạng thái. Con người vẫn xác định mục tiêu và phê duyệt những bước cần kiểm soát.

Slide trình bày các ví dụ FPT Retail và MoMo để minh họa ứng dụng tại Việt Nam. Điều em chú ý là kết quả chuyển đổi đi kèm các bước build, kiểm thử và kiểm tra bảo mật, thay vì chỉ dừng ở sinh mã nguồn hoặc Terraform. Các kết quả này thuộc tình huống được báo cáo trong tài liệu, không phải mức hiệu quả mặc định cho mọi dự án.

Từ góc nhìn sinh viên thực tập, em chưa áp dụng ngay một quy trình migration quy mô lớn. Phần có thể vận dụng trước là lập danh sách thành phần, xác định phụ thuộc, chuẩn bị cách quay lại và kiểm chứng từng thay đổi trước khi mở rộng.

#### 3.4. Phương pháp phát triển ứng dụng với Kiro

Chương trình giới thiệu hai hướng workshop: **Build with Kiro: From Spec to Working Application** và **Build & Deploy AI Agents on Amazon Bedrock AgentCore using Vibe Coding with Kiro**. Track A bắt đầu từ mô tả nhu cầu, sau đó rà soát yêu cầu, thiết kế và kế hoạch tác vụ trước khi phát triển ứng dụng. Track B hướng đến xây dựng agent và triển khai lên môi trường đám mây.

Bài học em tiếp thu từ cách tổ chức workshop là cần kiểm tra yêu cầu và thiết kế trước khi chấp nhận mã do AI sinh. Một yêu cầu chưa rõ có thể tạo ra mã chạy được nhưng sai mục đích. Với spec-driven development, tài liệu yêu cầu và danh sách tác vụ giúp đối chiếu sản phẩm với mục tiêu ban đầu, đồng thời tạo cơ sở cho kiểm thử và trao đổi trong nhóm.

Phần này tổng hợp mục tiêu và phương pháp trong tài liệu workshop; chưa ghi nhận sản phẩm lab hoàn thành hay kết quả triển khai cá nhân.

### 4. Bài học đối với bản thân

Sau khi hệ thống hóa nội dung, em nhận thấy kiến thức nền tảng AWS vẫn là điều kiện cần để sử dụng công cụ AI có hiệu quả. Muốn kiểm tra cấu hình do công cụ tạo, em phải hiểu IAM, mạng, lưu trữ và cách ứng dụng kết nối với nhau. Nếu chỉ dựa vào câu trả lời của AI, em khó phát hiện quyền quá rộng, luồng dữ liệu sai hoặc tài nguyên gây phát sinh chi phí.

Bài học thứ hai là **đánh giá theo bằng chứng**. Một câu trả lời có vẻ hợp lý cần được đối chiếu nguồn; một thay đổi mã nguồn cần qua kiểm thử; một hành động API cần có trạng thái thực thi. Khi chưa đủ dữ liệu, cần ghi rõ giới hạn thay vì kết luận chắc chắn.

Bài học thứ ba là **thiết kế phạm vi nhỏ và đo được**. Với nguồn lực thực tập, một chức năng có yêu cầu rõ, dữ liệu được chuẩn bị và tiêu chí nghiệm thu cụ thể sẽ giúp em học sâu hơn việc tích hợp nhiều dịch vụ nhưng không kiểm chứng được kết quả.

### 5. Hướng áp dụng trong thời gian thực tập

| Phạm vi | Việc dự kiến thực hiện | Kết quả cần kiểm tra |
|---|---|---|
| Nền tảng AWS | Rà soát luồng truy cập, IAM và cách lưu cấu hình trong bài lab | Giải thích được quyền cần thiết và xác định được lỗi truy cập |
| DropIt | Đề xuất chuẩn hóa metadata tài liệu, chủ sở hữu, phạm vi chia sẻ và phiên bản; nghiên cứu trợ lý tra cứu ở chế độ chỉ đọc | Truy xuất đúng tài liệu, không lộ nội dung ngoài quyền người dùng |
| FitJoy | Áp dụng cách viết yêu cầu, chia tác vụ và kiểm thử khi sử dụng công cụ hỗ trợ lập trình | Tính năng đáp ứng tiêu chí đã xác định; đây là hướng áp dụng phương pháp, chưa phải triển khai AWS |
| Chất lượng dữ liệu | Viết một data contract nhỏ cho dữ liệu đầu vào của chức năng thử nghiệm | Phát hiện thiếu trường, sai kiểu và dữ liệu không còn hiệu lực |
| Tài liệu kỹ thuật | Ghi lại giả định, thay đổi, kết quả kiểm thử và giới hạn | Người khác có thể đọc hiểu và thực hiện lại các bước chính |

Các mục trên là kế hoạch vận dụng sau sự kiện, chưa phải kết quả đã hoàn thành. Em ưu tiên hoàn thiện nền tảng và một luồng thử nghiệm có thể kiểm tra trước khi mở rộng sang agent có quyền thay đổi dữ liệu.

### 6. Kết luận

Sự kiện giúp em nhìn việc xây dựng ứng dụng Cloud và AI như một quy trình kỹ thuật đầy đủ: hiểu bài toán, chuẩn bị dữ liệu, thiết kế quyền, triển khai, kiểm thử và theo dõi vận hành. Giá trị em tiếp thu rõ nhất là vai trò của nền tảng dữ liệu và khả năng kiểm chứng kết quả. Đây cũng là định hướng để em tiếp tục học AWS và hoàn thiện dự án trong thời gian thực tập.

### Hình ảnh minh chứng

![Ảnh lưu niệm cùng các bạn tham dự AWS for Software & Financial Services Companies Day.](/images/4-EventParticipated/aws-financial-services-day-evidence.png)

*Ảnh lưu niệm cùng các bạn tham dự AWS for Software & Financial Services Companies Day.*

![Thẻ tham dự và không gian hội thảo AWS for Software & Financial Services Companies Day.](/images/4-EventParticipated/aws-financial-services-day-badge.jpg)

*Thẻ tham dự và không gian hội thảo AWS for Software & Financial Services Companies Day.*

![Nội dung chia sẻ về nền tảng dữ liệu, chất lượng truy xuất RAG và bộ nhớ của AI Agent.](/images/4-EventParticipated/aws-financial-services-day-data-session.jpg)

*Nội dung chia sẻ về nền tảng dữ liệu, chất lượng truy xuất RAG và bộ nhớ của AI Agent.*
