import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

/**
 * API endpoint to save updated use cases back to the master CSV
 * This ensures two-way sync between UI and CSV
 */
export async function POST(request: NextRequest) {
  try {
    const { csvContent } = await request.json();
    
    if (!csvContent) {
      return NextResponse.json(
        { error: 'CSV content is required' },
        { status: 400 }
      );
    }
    
    // Path to the master CSV file
    const csvPath = path.join(process.cwd(), 'public', 'data', 'master-use-cases.csv');
    
    // Write the updated CSV content
    await writeFile(csvPath, csvContent, 'utf-8');
    
    return NextResponse.json({
      success: true,
      message: 'Use cases saved successfully',
    });
  } catch (error) {
    console.error('Error saving use cases:', error);
    return NextResponse.json(
      { error: 'Failed to save use cases' },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to fetch the current CSV content
 */
export async function GET() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/data/master-use-cases.csv`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch CSV');
    }
    
    const csvContent = await response.text();
    
    return NextResponse.json({
      success: true,
      csvContent,
    });
  } catch (error) {
    console.error('Error fetching use cases:', error);
    return NextResponse.json(
      { error: 'Failed to fetch use cases' },
      { status: 500 }
    );
  }
}


