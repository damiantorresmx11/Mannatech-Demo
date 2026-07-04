import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const REVIEWS_FILE = path.join(process.cwd(), "data", "reviews.json");

interface Review {
  id: string;
  productId: string;
  name: string;
  email: string;
  rating: number;
  comment: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

function readReviews(): Review[] {
  try {
    if (!fs.existsSync(REVIEWS_FILE)) {
      fs.mkdirSync(path.dirname(REVIEWS_FILE), { recursive: true });
      fs.writeFileSync(REVIEWS_FILE, "[]", "utf-8");
      return [];
    }
    const data = fs.readFileSync(REVIEWS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeReviews(reviews: Review[]) {
  fs.mkdirSync(path.dirname(REVIEWS_FILE), { recursive: true });
  fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2), "utf-8");
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");
  const all = searchParams.get("all"); // for admin

  const reviews = readReviews();

  if (all === "true") {
    return NextResponse.json(reviews);
  }

  if (!productId) {
    return NextResponse.json(
      { error: "productId is required" },
      { status: 400 }
    );
  }

  const filtered = reviews.filter(
    (r) => r.productId === productId && r.status === "approved"
  );

  return NextResponse.json(filtered);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, name, email, rating, comment } = body;

    if (!productId || !name || !email || !rating || !comment) {
      return NextResponse.json(
        { error: "All fields are required: productId, name, email, rating, comment" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    const reviews = readReviews();

    const newReview: Review = {
      id: crypto.randomUUID(),
      productId,
      name,
      email,
      rating: Number(rating),
      comment,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    reviews.push(newReview);
    writeReviews(reviews);

    return NextResponse.json(newReview, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "id and status are required" },
        { status: 400 }
      );
    }

    if (!["pending", "approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be pending, approved, or rejected" },
        { status: 400 }
      );
    }

    const reviews = readReviews();
    const index = reviews.findIndex((r) => r.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      );
    }

    reviews[index].status = status;
    writeReviews(reviews);

    return NextResponse.json(reviews[index]);
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
