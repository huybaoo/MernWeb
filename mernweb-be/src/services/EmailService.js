const nodemailer = require("nodemailer");

const sendEmailCreateOrder = async (
  email,
  orderItems,
  shippingAddress,
  shippingMethod,
  paymentMethod,
  shippingPrice,
  totalPrice
) => {
  const convertPrice = (value) => {
    return Number(value).toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  const shippingMethodText = {
    fast: "Giao hàng nhanh",
    gojek: "Giao hàng tiết kiệm",
  };

  const paymentMethodText = {
    later_money: "Thanh toán khi nhận hàng",
    paypal: "Thanh toán bằng Paypal",
  };

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_ACCOUNT,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const listItemHTML = orderItems
    .map((item, index) => {
      const finalPrice =
        item.price * item.amount * (1 - (item.discount || 0) / 100);
      return `
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">${index + 1}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">
          ${item.name}<br/>
          <img src="${item.image}" alt="" width="60"/>
        </td>
        <td style="border: 1px solid #ddd; padding: 8px;">
          ${item.discount > 0
            ? `<span style="text-decoration: line-through;">${convertPrice(
                item.price
              )}</span><br/>
              <span style="color: green;">-${item.discount}% = ${convertPrice(
                item.price * (1 - item.discount / 100)
              )}</span>`
            : convertPrice(item.price)}
        </td>
        <td style="border: 1px solid #ddd; padding: 8px;">${item.amount}</td>
        <td style="border: 1px solid #ddd; padding: 8px; color: red; font-weight: 600;">${convertPrice(
          finalPrice
        )}</td>
      </tr>`;
    })
    .join("");

  const emailHTML = `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: auto;">
      <h2 style="text-align: center; color: #2d3748;">🛍 MERNWEB - Xác nhận đơn hàng</h2>
      <p>Xin chào <b>${shippingAddress.name}</b>,</p>
      <p>Cảm ơn bạn đã đặt hàng tại <strong>MERNWEB</strong>. Dưới đây là thông tin đơn hàng của bạn:</p>

      <h3>Thông tin người nhận:</h3>
      <ul>
        <li><b>Họ tên:</b> ${shippingAddress.name}</li>
        <li><b>Số điện thoại:</b> ${shippingAddress.phone}</li>
        <li><b>Địa chỉ giao hàng:</b> ${shippingAddress.address}</li>
      </ul>

      <h3>Thông tin đơn hàng:</h3>
      <ul>
        <li><b>Phương thức giao hàng:</b> ${shippingMethodText[shippingMethod] || shippingMethod}</li>
        <li><b>Phương thức thanh toán:</b> ${paymentMethodText[paymentMethod] || paymentMethod}</li>
        <li><b>Phí giao hàng:</b> ${convertPrice(shippingPrice)}</li>
      </ul>

      <h3>Danh sách sản phẩm:</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <thead style="background-color: #f2f2f2;">
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px;">#</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Sản phẩm</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Đơn giá</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Số lượng</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          ${listItemHTML}
        </tbody>
      </table>

      <h3 style="text-align: right; margin-top: 20px;">Tổng cộng: 
        <span style="color: red;">${convertPrice(totalPrice)}</span>
      </h3>

      <p style="margin-top: 30px;">Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với bộ phận hỗ trợ của chúng tôi.</p>
      <p>Trân trọng,<br><strong>MERNWEB</strong></p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.MAIL_ACCOUNT,
    to: email,
    subject: "MERNWEB | Xác nhận đơn hàng của bạn",
    html: emailHTML,
  });
};

module.exports = {
  sendEmailCreateOrder,
};
