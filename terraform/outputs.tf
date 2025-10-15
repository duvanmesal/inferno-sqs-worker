output "start_payment_queue_url" {
  value = module.q_start_payment.queue_url
}

output "check_balance_queue_url" {
  value = module.q_check_balance.queue_url
}

output "transaction_queue_url" {
  value = module.q_transaction.queue_url
}
