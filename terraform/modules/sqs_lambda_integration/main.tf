resource "aws_iam_policy" "sqs_access" {
  name   = "${var.name}-sqs-policy"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = concat(
      [
        {
          Effect   = "Allow"
          Action   = [
            "sqs:ReceiveMessage",
            "sqs:DeleteMessage",
            "sqs:GetQueueAttributes"
          ]
          Resource = var.queue_arn
        }
      ],
      var.next_queue_arn != "" ? [
        {
          Effect   = "Allow"
          Action   = ["sqs:SendMessage"]
          Resource = var.next_queue_arn
        }
      ] : []
    )
  })
}
