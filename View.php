 <?php
    if ( ! defined('BASEPATH')) exit('No direct script access allowed');
    
    class Loan_Model extends CI_Model
    {
        public function __construct()
        {
            parent::__construct();
            $this->createLoansView();
        }

        public function saveNewLoan($data)
        {
            $this->db->query("set AUTOCOMMIT = 0");
            $this->db->query("start transaction");

                $result     =   $this->db->insert('loans_request',$data);
                if(!$result)
                {
                    $this->db->query("rollback");
                    return false;
                }

            $this->db->query("commit");
                return true;
        }

        public function getPendingLoanList($Id =  null)
        {
            if($Id != null)
            {
                $result =   $this->db->query
                            (
                                "SELECT
                                    lr.RequestId,
                                    lr.LoanType,
                                    lr.RepaymentPeriod,
                                    lr.AmountRequested,
                                    lr.InterestRate,
                                    lr.RequestDate,
                                    lr.DateApproved,
                                    lr.DateDue,
                                    lr.Note,
                                    lr.Status,
                                    members.Id,
                                    members.FirstName,
                                    members.Surname,
                                    members.OtherNames,
                                    members.EmailAddress,
                                    members.Telephone,
                                    members.Address,
                                    members.Contribution
                                FROM loans_request lr
                                INNER JOIN members
                                ON lr.MemberId = members.Id
                                WHERE lr.Active = '1'
                                AND lr.Status = 'Pending Approval'
                                AND lr.MemberId = '$Id'
                                OR lr.Status    ='Pending Payment'
                                AND lr.Active ='1'
                                AND lr.MemberId = '$Id'
                                "
                            );
            }
            else
            {
                $result     =   $this->db->query
                            (
                                "SELECT
                                    lr.RequestId,
                                    lr.LoanType,
                                    lr.RepaymentPeriod,
                                    lr.AmountRequested,
                                    lr.InterestRate,
                                    lr.RequestDate,
                                    lr.DateApproved,
                                    lr.DateDue,
                                    lr.Note,
                                    lr.Status,
                                    members.Id,
                                    members.FirstName,
                                    members.Surname,
                                    members.OtherNames,
                                    members.EmailAddress,
                                    members.Telephone,
                                    members.Address,
                                    members.Contribution
                                FROM loans_request lr
                                INNER JOIN members
                                ON lr.MemberId = members.Id
                                WHERE lr.Active = '1'
                                AND lr.Status    ='Pending Payment'
                                OR lr.Status    ='Pending Approval'
                                AND lr.Active ='1'
                                "
                            );
            }

            return $result->result();
        }

        public function getLoanById($Id)
        {
            $result =   $this->db->query
                (
                    "
                        SELECT
                            lv.*,
                            lr.RequestID,
                            lr.LoanType,
                            lr.RepaymentPeriod,
                            lr.AmountRequested,
                            lr.InterestRate,
                            lr.RequestDate,
                            lr.DateApproved,
                            lr.DateDue,
                            lr.DateNeeded,
                            lr.Note,
                            lr.Status,
                            members.Id,
                            members.SapNumber,
                            members.FirstName,
                            members.OtherNames,
                            members.Surname,
                            members.Telephone,
                            members.EmailAddress
                        FROM loans_request lr
                        LEFT JOIN loans_view lv
                        ON lr.`RequestId` = lv.RequestId
                        INNER JOIN members ON
                        lr.MemberId = members.Id
                        WHERE lr.RequestId = '$Id'
                    "
                );
//            $result =   $this->db->query("SELECT * FROM loans_view WHERE RequestID = $Id");

            return $result->row();
        }

        public function updateLoan($data, $RequestId)
        {
            $this->db->where("RequestId = $RequestId");
            return $this->db->update('loans_request',$data);
        }

        public function addNewNegotiation($data)
        {
            $this->db->query("set AUTOCOMMIT = 0");
            $this->db->query("start transaction");

            $saveData   =   array(
                "RequestId" => $data['LoanId'],
                "MemberId" => $data['MemberId'],
                "NewAmount" => $data['NewAmountRequested'],
                "NewInterestRate" => $data['NewInterestRate'],
                "NewPeriod" => $data['NewRepaymentPeriod'],
            );

            if($this->db->insert("loan_negotiations",$saveData))
            {
                $this->db->where("RequestId = ".$data['LoanId']);
                $result     =   $this->db->update('loans_request',array('Active'=> '0'));
                if($result)
                {
                    $this->db->query("commit");
                    return true;
                }
                else{
                    $this->db->query("rollback");
                    return false;
                }
            }
            else{
                $this->db->query('rollback');
                return false;
            }
        }

        public function compareLoanVariables($data, $loanId)
        {
            $origLoanData   =   $this->getLoanById($loanId);

            if($origLoanData->AmountRequested == $data['NewAmountRequested'] && $origLoanData->InterestRate == $data['NewInterestRate'] && $origLoanData->RepaymentPeriod == $data['NewRepaymentPeriod'])
            {
                return true;
            }
            else{
                return false;
            }
        }

        public function acceptLoan($data, $requestId)
        {

            $this->db->query('set autocommit = 0');
            $this->db->query('start transaction');
            $this->db->where("RequestId =  $requestId");
            if(!$this->db->update('loans_request',$data))
            {
                $this->db->query('rollback');
                return false;
            }
            $this->db->query('commit');
            $this->db->query('set autocommit = 1');
            return true;
        }

        public function deleteLoan($requestId)
        {
            $this->db->query('set autocommit = 0');

            $this->db->query('start transaction');

            return $this->db->query("DELETE FROM loans_request WHERE RequestId = $requestId");

        }

        public function getUnpaidLoansCount()
        {
            $result     =   $this->db->query
                                        ("
                                           SELECT
                                                count(RequestId) as LoanDebtCount
                                            FROM loans_request
                                            WHERE PaymentComplete = '0'
                                            AND Approved = '1'
                                        ");
            return $result->row();
        }

        public function getLoanReceivableCount()
        {
            $result     =   $this->db->query
                ("
                       SELECT
                            count(RequestId) as Receivables
                        FROM loans_view
                        WHERE PaymentStatus = 'Incomplete'
                 ");
            return $result->row();
        }

        public function getDebtList()
        {
            $result     =   $this->db->query
                ("
                            SELECT lv.*
                            FROM loans_view lv
                            WHERE lv.PaymentStatus = 'Incomplete'
                            OR CAST(lv.AmountRepaid AS DECIMAL) < CAST(lv.AmountDue AS DECIMAL)
                ");
            return $result->result();
        }

        public function newReceivable($RequestId, $MemberID, $Amount, $PaymentDate, $Description, $BankAccountId)
        {
            $this->db->query('set autocommit = 0');
               $this->db->query('start transaction');
                    //Save Loan Payment to `financial_transactions` Table To Start Transaction
                    $result =   $this->db->query("
                                INSERT INTO financial_transactions
                                (
                                  TransactionDate, MemberID, TransactionDescription, TransactionType, TransactionSubType, TransactionPostDate, TransactionAmount
                                )
                                VALUES
                                (
                                    '$PaymentDate', $MemberID, '$Description', 'Loan', 'PayOut', '".date('Y-m-d H:i:s')."', $Amount
                                )
                            ");

                            if(!$result)
                            {
                                $this->db->query('rollback');
                                return false;
                            }


                        //Get The Insert ID of Last Insert
                       $TransactionId  =   $this->db->insert_id();

                        //Enter Credit Into Ledger for Bank With ID = $BankAccountId for Reduction in Cash
                        $result2 =   $this->db->query
                                        ("
                                            INSERT INTO general_ledger
                                            (
                                              AccountID, TransactionID, EntryAmount, EntryDescription, EntryType
                                            )
                                            VALUES
                                            (
                                                '$BankAccountId', '$TransactionId', $Amount, 'Credit Bank', 'Credit'
                                            )
                                        ");
                        var_dump("2.    ".$result);
                        if(!$result2)
                        {
                            $this->db->query('rollback');
                            return false;
                        }

                        //Enter Debit Into Ledger For Accounts Receivable with ID From SELECT Statement
                        $result3    =   $this->db->query("
                                          INSERT INTO general_ledger
                                            (
                                              AccountID, TransactionID, EntryAmount, EntryDescription, EntryType
                                            )
                                                SELECT AccountID, '$TransactionId', $Amount,'Debit Account Receivable', 'Debit'
                                                FROM accounts WHERE AccountName = 'Accounts Receivable' AND AccountCreatedBy = 'System'");

                        if(!$result3)
                        {
                            $this->db->query('rollback');
                            return false;
                        }


                        //Update loan_request and Change status and date collected
                        $result4    =   $this->db->query
                                        ("
                                            UPDATE loans_request
                                              SET
                                                DateCollected = '$PaymentDate',
                                                TransactionId = '$TransactionId',
                                                Status = 'Receivable'
                                                WHERE RequestID   = $RequestId
                                        ");
                        var_dump("4.    ".$result);
                        if(!$result4)
                        {
                            $this->db->query('rollback');
                            return false;
                        }

                        //Commit Transaction
                        $this->db->query('commit');
                        //Change the Autocommit to 1
                        $this->db->query('set autocommit = 1');
                        //return true to show end of function was reached
                        return true;
        }

        public function receivePayment($TransactionData)
        {
            $this->db->query('set autocommit = 0');
            $this->db->query('start transaction');
                $result1    =   $this->db->query(
                                "INSERT INTO financial_transactions
                                    (
                                      MemberID, TransactionDate, TransactionDescription, TransactionType,
                                      TransactionSubType, ParentTransaction,  TransactionPostDate,TransactionAmount
                                    )
                                    VALUES
                                    (
                                      ".$TransactionData['MemberID'].",
                                      '".$TransactionData['Date']."',
                                      '".$TransactionData['Description']."',
                                      'Loan',
                                      'PayIn',
                                      ".$TransactionData['TransactionID'].",
                                      '".date('Y-m-d H:i:s')."',
                                      ".$TransactionData['Amount']."
                                    )"
                );
                if(!$result1)
                {
                    $this->db->query("rollback");
                    return false;
                }
            //Below We Make Entry to General Ledger, result2 and result3 represent the double Entry INTO GL ACCOUNTS
                $currentTransactionID  =   $this->db->insert_id();

                $result2     =   $this->db->query
                ("
                                    INSERT INTO general_ledger
                                    (
                                      AccountID, TransactionID, EntryAmount, EntryDescription, EntryType
                                    )
                                    VALUES
                                    (
                                      ".$TransactionData['AccountID'].",
                                      $currentTransactionID,
                                      ".$TransactionData['Amount'].",
                                      '".$TransactionData['EntryDescription']."',
                                      '".$TransactionData['EntryType']."'
                                    )
                ");
            if(!$result2)
            {
                $this->db->query('rollback');
                return false;
            }

            $result3     =   $this->db->query
                ("
                                    INSERT INTO general_ledger
                                    (
                                      AccountID, TransactionID, EntryAmount, EntryDescription, EntryType
                                    )
                                    SELECT
                                      AccountID,
                                      '$currentTransactionID',
                                      ".$TransactionData['Amount'].",
                                      'Credit Accounts Receivable',
                                      'Credit'
                                    FROM accounts WHERE AccountName='Accounts Receivable' AND AccountCreatedBy = 'System'
                ");
            if(!$result3)
            {
                $this->db->query('rollback');
                return false;
            }

            $this->db->query('commit');
            $this->db->query('set autocommit = 1');
            return true;
        }

        public function createLoansView()
        {
            $this->db->query
                ("
                    CREATE OR REPLACE VIEW loans_view AS
                        SELECT
                            ft.TransactionID,
                            ft.TransactionDate,
                            ft.TransactionDescription,
                            ft.TransactionType,
                            ft.`TransactionSubType`,
                            ft.`TransactionAmount`,
                            lr.RequestID,
                            lr.AmountRequested,
                            lr.DateNeeded,
                            lr.LoanType,
                            lr.RequestDate,
                            lr.Note,
                            lr.InterestRate,
                            (lr.InterestRate/100)*lr.AmountRequested AS Interest,
                            (lr.InterestRate/100)*lr.AmountRequested + lr.AmountRequested AS AmountDue,
                            IFNULL(
                                (SELECT
                                    CASE
                                        WHEN SUM(ft2.TransactionAMount) > (lr.AmountRequested + lr.AmountRequested*lr.InterestRate/100)
                                        THEN
                                            'Over'
                                        WHEN SUM(ft2.TransactionAMount) = (lr.AmountRequested + lr.AmountRequested*lr.InterestRate/100)
                                        THEN
                                            'Complete'
                                        ELSE
                                            'Incomplete'
                                    END
                                FROM financial_transactions ft2
                                WHERE ft.`TransactionID`	=	ft2.ParentTransaction
                                GROUP BY ft2.ParentTransaction),'Incomplete'
                            )  AS PaymentStatus,
                            IFNULL
                            (
                                (
                                    SELECT
                                        SUM(ft2.`TransactionAmount`)
                                    FROM financial_transactions ft2
                                    WHERE ft.`TransactionID`	=	ft2.ParentTransaction
                                    GROUP BY ft2.ParentTransaction
                                ), 0
                            ) AS AmountRepaid,
                            IFNULL
                            (
                                (
                                    SELECT
                                        (lr.AmountRequested + lr.AmountRequested*lr.InterestRate/100) - SUM(ft2.`TransactionAmount`)
                                    FROM financial_transactions ft2
                                    WHERE ft.`TransactionID`	=	ft2.ParentTransaction
                                    GROUP BY ft2.ParentTransaction
                                ), lr.AmountRequested + lr.AmountRequested*lr.InterestRate/100
                            ) AS Balance,
                            m.Id,
                            m.SapNumber,
                            m.FirstName,
                            m.OtherNames,
                            m.Surname,
                            m.Telephone,
                            m.EmailAddress
                        FROM financial_transactions ft
                        INNER JOIN loans_request lr
                        ON lr.TransactionID = ft.TransactionID
                        INNER JOIN members m
                        ON ft.`MemberID` = m.Id
                        WHERE ft.`ParentTransaction` IS NULL
                        AND ft.`TransactionType` = 'Loan'
                        AND ft.`TransactionSubType` ='PayOut'
                ");
        }

        public function test()
        {
        }
    }
