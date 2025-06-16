module lango_token::lango {
    use std::signer;
    use std::string;
    use std::option::{Self, Option};
    use aptos_framework::coin::{Self, Coin, MintCapability, BurnCapability};
    use aptos_framework::account;

    // Error codes
    const E_NOT_OWNER: u64 = 1;
    const E_INSUFFICIENT_BALANCE: u64 = 2;
    const E_NOT_INITIALIZED: u64 = 3;

    // Lango token struct - represents the token type
    struct LangoToken has key {}

    // Capabilities for minting and burning tokens
    struct Capabilities has key {
        mint_cap: MintCapability<LangoToken>,
        burn_cap: BurnCapability<LangoToken>,
        owner: address,
    }

    // Initialize the Lango token
    // This should be called once by the module publisher
    public entry fun initialize(admin: &signer) acquires Capabilities {
        let admin_addr = signer::address_of(admin);
        
        // Initialize the coin with metadata
        let (burn_cap, freeze_cap, mint_cap) = coin::initialize<LangoToken>(
            admin,
            string::utf8(b"LangoToken"),      // Token name
            string::utf8(b"LG"),         // Token symbol
            8,                           // Decimals
            true,                        // Monitor supply
        );

        // Store capabilities
        move_to(admin, Capabilities {
            mint_cap,
            burn_cap,
            owner: admin_addr,
        });

        // Destroy freeze capability as we don't need it
        coin::destroy_freeze_cap(freeze_cap);

        // Register the admin to receive coins
        coin::register<LangoToken>(admin);
        
        // Borrow the capabilities and mint initial supply
        let caps = borrow_global<Capabilities>(@lango_token);
        let initial_coins = coin::mint<LangoToken>(10000000000, &caps.mint_cap);
        
        // Deposit initial supply to admin
        coin::deposit<LangoToken>(admin_addr, initial_coins);
    }

    // Mint new tokens - restricted to owner
    public entry fun mint(admin: &signer, to: address, amount: u64) acquires Capabilities {
        let admin_addr = signer::address_of(admin);
        let caps = borrow_global<Capabilities>(@lango_token);
        
        // Check if caller is owner
        assert!(admin_addr == caps.owner, E_NOT_OWNER);
        
        // Mint tokens
        let coins = coin::mint<LangoToken>(amount, &caps.mint_cap);
        
        // Deposit to recipient
        coin::deposit<LangoToken>(to, coins);
    }

    // Transfer tokens - public function similar to ERC20 transfer
    public entry fun transfer(from: &signer, to: address, amount: u64) {
        let from_addr = signer::address_of(from);
        
        // Check balance
        assert!(coin::balance<LangoToken>(from_addr) >= amount, E_INSUFFICIENT_BALANCE);
        
        // Perform transfer
        coin::transfer<LangoToken>(from, to, amount);
    }

    // Donate function - allows transferring tokens from one address to another
    // Note: In Move, you need the sender's signature, so this works differently than Solidity
    public entry fun donate(from: &signer, to: address, amount: u64) {
        transfer(from, to, amount);
    }

    // Register an account to hold LangoToken
    public entry fun register(account: &signer) {
        coin::register<LangoToken>(account);
    }

    // View functions
    
    // Get token balance for an address
    #[view]
    public fun balance(addr: address): u64 {
        coin::balance<LangoToken>(addr)
    }
    
    // Get token name
    #[view]
    public fun name(): string::String {
        coin::name<LangoToken>()
    }
    
    // Get token symbol
    #[view]
    public fun symbol(): string::String {
        coin::symbol<LangoToken>()
    }
    
    // Get token decimals
    #[view]
    public fun decimals(): u8 {
        coin::decimals<LangoToken>()
    }
    
    // Get total supply
    #[view]
    public fun total_supply(): Option<u128> {
        coin::supply<LangoToken>()
    }
    
    // Check if account is registered to hold LangoToken
    #[view]
    public fun is_registered(addr: address): bool {
        coin::is_account_registered<LangoToken>(addr)
    }

    // Get owner address
    #[view]
    public fun owner(): address acquires Capabilities {
        let caps = borrow_global<Capabilities>(@lango_token);
        caps.owner
    }

    #[test_only]
    use aptos_framework::account::create_account_for_test;

    #[test(admin = @lango_token)]
    public fun test_initialize(admin: &signer) acquires Capabilities {
        initialize(admin);
        
        let admin_addr = signer::address_of(admin);
        assert!(balance(admin_addr) == 10000000000, 1); // 100 * 10^8
        assert!(owner() == admin_addr, 2);
    }

    #[test(admin = @lango_token, user = @0x456)]
    public fun test_mint(admin: &signer, user: &signer) acquires Capabilities {
        initialize(admin);
        let user_addr = signer::address_of(user);
        
        mint(admin, user_addr, 1000000000); // 10 tokens
        assert!(balance(user_addr) == 1000000000, 1);
    }

    #[test(admin = @lango_token, user1 = @0x456, user2 = @0x789)]
    public fun test_transfer(admin: &signer, user1: &signer, user2: &signer) acquires Capabilities {
        initialize(admin);
        let user1_addr = signer::address_of(user1);
        let user2_addr = signer::address_of(user2);
        
        // Mint tokens to user1
        mint(admin, user1_addr, 1000000000);
        
        // Register user2
        register(user2);
        
        // Transfer from user1 to user2
        transfer(user1, user2_addr, 500000000);
        
        assert!(balance(user1_addr) == 500000000, 1);
        assert!(balance(user2_addr) == 500000000, 2);
    }
}