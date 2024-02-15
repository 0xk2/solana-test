use anchor_lang::prelude::*;

#[account]
pub struct UserStats {
  pub level: u16,
  pub name: String,
  pub bump: u8,
}

impl UserStats {
  pub const SEED_PREFIX: &'static [u8; 10] = b"user_stats";
  // space: 8 discriminator + 2 level + 4 name length + 200 name + 1 bump
  pub const SPACE: usize = 8 + 2 + 4 + 200 + 1;
}
