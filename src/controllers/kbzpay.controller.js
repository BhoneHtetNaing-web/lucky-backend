const createKBZPayRequest = async (req, res) => {
  const { booking_id, amount } = req.body;

  const payment = await pool.query(
    `INSERT INTO payments (booking_id, method, amount)
        VALUES ($1, 'KBZPAY', $2)
        RETURNING *`,
    [booking_id, amount],
  );

  res.json({
    success: true,
    payment_id: payment.rows[0].id,
    qr_url: "https://your-static-qr.png",
    instructions: "Send money to KBZPay number 09770953142",
  });
};

const submitKBZProof = async (req, res) => {
  const { payment_id, txn_id } = req.body;
  const file = req.file;

  await pool.query(
    `UPDATE payments
     SET txn_id=$1,
     proof_image=$2,
     status='PENDING_VERIFICATION'
     WHERE id=$3`,
    [txn_id, file.path, payment_id],
  );

  res.json({
    message: "Submitted for verification",
  });
};

module.exports = {
  createKBZPayRequest,
  submitKBZProof,
}
