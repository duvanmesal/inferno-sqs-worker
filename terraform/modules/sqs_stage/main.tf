resource "aws_sqs_queue" "main" {
  name                        = "${var.name}.fifo"
  fifo_queue                  = true
  content_based_deduplication = true
  visibility_timeout_seconds  = var.visibility_timeout
  receive_wait_time_seconds   = 10

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.dlq.arn
    maxReceiveCount     = 3
  })

  kms_master_key_id = "alias/aws/sqs"

  tags = var.tags
}

resource "aws_sqs_queue" "dlq" {
  name       = "${var.name}-dlq.fifo"
  fifo_queue = true
  tags       = var.tags
}

output "queue_arn" {
  value = aws_sqs_queue.main.arn
}

output "queue_url" {
  value = aws_sqs_queue.main.id
}
