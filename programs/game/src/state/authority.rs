use anchor_lang::prelude::*;

#[account]
pub struct Authority {
  pub bump: u8,
}

impl Authority {
  pub const SEED_PREFIX: &'static [u8; 9] = b"authority";
  // space: 8 discriminator + 2 level + 4 name length + 200 name + 1 bump
  pub const SPACE: usize = 8 + 10;
}
