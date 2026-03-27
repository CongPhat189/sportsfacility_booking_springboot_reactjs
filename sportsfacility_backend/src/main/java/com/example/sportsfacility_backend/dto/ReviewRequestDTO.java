package com.example.sportsfacility_backend.dto;

public class ReviewRequestDTO {
  private Long bookingId;
  private Byte rating;
  private String comment;

  public Long getBookingId() { return bookingId; }
  public void setBookingId(Long bookingId) { this.bookingId = bookingId; }
  public Byte getRating() { return rating; }
  public void setRating(Byte rating) { this.rating = rating; }
  public String getComment() { return comment; }
  public void setComment(String comment) { this.comment = comment; }
  
}
