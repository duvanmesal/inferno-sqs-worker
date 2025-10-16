terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  required_version = ">= 1.6.0"
}

provider "aws" {
  region = "us-east-1"
}

# ========== COLAS SQS ==========
module "q_start_payment" {
  source = "./modules/sqs_stage"
  name   = "q-start-payment"
  tags   = { service = "payments", stage = "dev" }
}

module "q_check_balance" {
  source = "./modules/sqs_stage"
  name   = "q-check-balance"
  tags   = { service = "payments", stage = "dev" }
}

module "q_transaction" {
  source = "./modules/sqs_stage"
  name   = "q-transaction"
  tags   = { service = "payments", stage = "dev" }
}

# ========== CONEXIONES SQS ↔ LAMBDA ==========
module "lambda_check_integration" {
  source         = "./modules/sqs_lambda_integration"
  name           = "check-balance"
  lambda_name    = "check-balance"
  queue_arn      = module.q_check_balance.queue_arn
  next_queue_arn = module.q_start_payment.queue_arn
}

module "lambda_start_integration" {
  source         = "./modules/sqs_lambda_integration"
  name           = "start-payment"
  lambda_name    = "start-payment"
  queue_arn      = module.q_start_payment.queue_arn
  next_queue_arn = module.q_transaction.queue_arn
}

module "lambda_transaction_integration" {
  source         = "./modules/sqs_lambda_integration"
  name           = "transaction"
  lambda_name    = "transaction"
  queue_arn      = module.q_transaction.queue_arn
  next_queue_arn = ""
}
