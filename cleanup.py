"""
Cleanup script for GA4 testing
"""

from pathlib import Path
import shutil

def cleanup():
    """Remove all test tokens and temporary files"""
    print("=== Cleaning up GA4 test files ===")
    
    # Remove token directory
    token_dir = Path('token')
    if token_dir.exists():
        print(f"Removing token directory: {token_dir}")
        shutil.rmtree(token_dir)
        print("✅ Removed existing tokens")
    else:
        print("No tokens found to clean up")

if __name__ == "__main__":
    cleanup()
    print("\nCleanup complete. Ready for fresh authentication.")