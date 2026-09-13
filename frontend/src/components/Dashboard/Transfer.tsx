import { Button, Card, Form, Alert } from "react-bootstrap";
import { useTransfer } from "@/hooks/useTransfer";

export default function Transfer() {
  const {
    amount, setAmount,
    accountNumber1, setAccountNumber1,
    accountNumber2, setAccountNumber2,
    loading, error, handleTransfer,
  } = useTransfer();

  return (
    <Card className="bank-card">
      <Card.Header className="card-header-primary">
        <h4>Transfer</h4>
      </Card.Header>
      <Card.Body>
        <Form>
          <Form.Group controlId="transfer-from" className="mb-3">
            <Form.Label>From account</Form.Label>
            <Form.Control
              value={accountNumber1}
              onChange={(e) => setAccountNumber1(e.target.value)}
              placeholder="Account number"
            />
          </Form.Group>
          <Form.Group  controlId="transfer-to" className="mb-3">
            <Form.Label>To account</Form.Label>
            <Form.Control
              value={accountNumber2}
              onChange={(e) => setAccountNumber2(e.target.value)}
              placeholder="Account number"
            />
          </Form.Group>
          <Form.Group  controlId="transfer-amount"className="mb-4">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </Form.Group>
          <div className="transfer-card">
            <Button
              variant="dark"
              onClick={(e) => { e.preventDefault(); void handleTransfer(); } }
              disabled={loading}
            >
              {loading ? "Processing…" : "Transfer"}
            </Button>
          </div>
          {error && (
            <Alert variant="danger" className="mt-3 mb-0">
              {error}
            </Alert>
          )}
        </Form>
      </Card.Body>
    </Card>
  );
}