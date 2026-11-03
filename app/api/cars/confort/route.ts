import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import CarConfortSecurityModel from '@/app/models/confortsecurity';
import connectDB from '@/lib/db';

// POST handler
export async function POST(request: NextRequest) {
    await connectDB();
    
    try {
        const data = await request.json();
        console.log("DATA_CREATE_CARCONFORTSECURITY", data);
        if (!data.carID || !data.key || !data.value) {
            return NextResponse.json({ msg: "MISSING_FIELDS" }, { status: 400 });
        }

        const newItem = await CarConfortSecurityModel.create(data);
        return NextResponse.json(newItem);
    } catch (error) {
        console.error("ERROR_CREATE_CARCONFORTSECURITY", error);
        return NextResponse.json({ msg: "ERROR_CREATE_CARCONFORTSECURITY" }, { status: 500 });
    }
}
// DELETE handler
export async function DELETE(request: NextRequest) {
    await connectDB();

    try {
        const { id } = await request.json();
        if (!id) {
            return NextResponse.json({ msg: "MISSING_ID" }, { status: 400 });
        }

        const deletedItem = await CarConfortSecurityModel.findByIdAndDelete(id);
        if (!deletedItem) {
            return NextResponse.json({ msg: "ITEM_NOT_FOUND" }, { status: 404 });
        }

        return NextResponse.json({ msg: "ITEM_DELETED", id });
    } catch (error) {
        console.error("ERROR_DELETE_CARCONFORTSECURITY", error);
        return NextResponse.json({ msg: "ERROR_DELETE_CARCONFORTSECURITY" }, { status: 500 });
    }
}