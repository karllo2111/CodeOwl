<?php

namespace App\Services;

use App\Models\CoinTransaction;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class CoinService
{
    /**
     * Add coins to a user with row locking.
     */
    public function addCoins(User $user, int $amount, string $reason, ?string $refType = null, ?int $refId = null): CoinTransaction
    {
        if ($amount <= 0) {
            throw new InvalidArgumentException("Amount to add must be positive.");
        }

        return DB::transaction(function () use ($user, $amount, $reason, $refType, $refId) {
            /** @var User $lockedUser */
            $lockedUser = User::where('id', $user->id)->lockForUpdate()->firstOrFail();

            $newBalance = $lockedUser->coins + $amount;
            $lockedUser->coins = $newBalance;
            $lockedUser->save();

            return CoinTransaction::create([
                'user_id' => $lockedUser->id,
                'amount' => $amount,
                'reason' => $reason,
                'ref_type' => $refType,
                'ref_id' => $refId,
                'balance_after' => $newBalance,
            ]);
        });
    }

    /**
     * Spend coins from a user with row locking. Balance can never go negative.
     */
    public function spendCoins(User $user, int $amount, string $reason, ?string $refType = null, ?int $refId = null): CoinTransaction
    {
        if ($amount <= 0) {
            throw new InvalidArgumentException("Amount to spend must be positive.");
        }

        return DB::transaction(function () use ($user, $amount, $reason, $refType, $refId) {
            /** @var User $lockedUser */
            $lockedUser = User::where('id', $user->id)->lockForUpdate()->firstOrFail();

            if ($lockedUser->coins < $amount) {
                throw new InvalidArgumentException("Saldo koin tidak mencukupi.");
            }

            $newBalance = $lockedUser->coins - $amount;
            $lockedUser->coins = $newBalance;
            $lockedUser->save();

            return CoinTransaction::create([
                'user_id' => $lockedUser->id,
                'amount' => -$amount,
                'reason' => $reason,
                'ref_type' => $refType,
                'ref_id' => $refId,
                'balance_after' => $newBalance,
            ]);
        });
    }

    /**
     * Get user coin balance.
     */
    public function getBalance(User $user): int
    {
        return (int) $user->coins;
    }
}
