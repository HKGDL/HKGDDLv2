#!/usr/bin/env python3
"""
Fix records in HKGD database by re-parsing the CSV file.
The CSV has columns grouped by player: Date (P1), Player 1, Video (P1), FPS (P1), Date (P2), ...
"""

import csv
import sqlite3
import os

CSV_PATH = "/home/lh201202729/Downloads/HKGD prev/HKGD Database - Classic Demon.csv"
DB_PATH = "/home/lh201202729/Downloads/HKGD prev/api/hkgd.db"

def parse_csv():
    """Parse the CSV and extract records."""
    records = []
    
    with open(CSV_PATH, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        header = next(reader)  # Skip header
        
        # Find column indices for each player
        # Pattern: Date (P1), Player 1, Video (P1), FPS (P1), Date (P2), Player 2, ...
        # Starting at column 4 (0-indexed)
        
        for row in reader:
            if not row or len(row) < 5:
                continue
            
            placement = row[0].strip()
            level_id = row[1].strip()
            level_name = row[2].strip()
            victor_count = row[3].strip()
            
            # Skip non-numeric placements (HKGD, Pending, etc.)
            if not placement.isdigit():
                continue
            
            # Parse each player's record
            # Each player has 4 columns: Date, Player, Video, FPS
            # Starting at column index 4
            player_idx = 0
            col = 4
            
            while col + 1 < len(row):
                date = row[col].strip() if col < len(row) else ''
                player = row[col + 1].strip() if col + 1 < len(row) else ''
                video = row[col + 2].strip() if col + 2 < len(row) else ''
                fps = row[col + 3].strip() if col + 3 < len(row) else ''
                
                if player and player != '':
                    records.append({
                        'level_id': level_id,
                        'level_name': level_name,
                        'player': player,
                        'date': date,
                        'video_url': video,
                        'fps': fps,
                        'placement': int(placement)
                    })
                    player_idx += 1
                
                col += 4  # Move to next player's columns
                
                # Safety limit
                if player_idx > 50:
                    break
    
    return records

def update_database(records):
    """Update the database with the correct records."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Get level mappings: level_id (GD ID) -> internal id
    cursor.execute("SELECT id, level_id, name FROM levels")
    levels = cursor.fetchall()
    
    # Create mapping from GD level_id to internal id
    level_map = {}
    for internal_id, gd_level_id, name in levels:
        level_map[gd_level_id] = internal_id
        level_map[name] = internal_id  # Also map by name as fallback
    
    # Clear existing records
    cursor.execute("DELETE FROM records")
    
    # Insert corrected records
    inserted = 0
    skipped = 0
    
    for r in records:
        # Find internal level ID
        internal_id = level_map.get(r['level_id']) or level_map.get(r['level_name'])
        
        if not internal_id:
            print(f"Skipping: Level not found - {r['level_name']} (ID: {r['level_id']})")
            skipped += 1
            continue
        
        # Clean up fps value
        fps = r['fps']
        if fps in ['', '/', 'V', '60/V', '288/V']:
            fps = None
        
        # Clean up video URL
        video_url = r['video_url'] if r['video_url'] and not r['video_url'].startswith('(') else None
        
        # Insert record
        try:
            cursor.execute("""
                INSERT INTO records (level_id, player, date, video_url, fps, cbf, attempts, mode)
                VALUES (?, ?, ?, ?, ?, 0, NULL, 'classic')
            """, (internal_id, r['player'], r['date'], video_url, fps))
            inserted += 1
        except Exception as e:
            print(f"Error inserting record for {r['player']} on {r['level_name']}: {e}")
            skipped += 1
    
    conn.commit()
    conn.close()
    
    print(f"\nResults:")
    print(f"  Inserted: {inserted}")
    print(f"  Skipped: {skipped}")
    print(f"  Total from CSV: {len(records)}")

def main():
    print("Parsing CSV...")
    records = parse_csv()
    print(f"Found {len(records)} records in CSV")
    
    print("\nUpdating database...")
    update_database(records)
    
    print("\nDone!")

if __name__ == "__main__":
    main()
