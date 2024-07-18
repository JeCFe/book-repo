﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Server.Domain;

#nullable disable

namespace Server.Domain.Migrations
{
    [DbContext(typeof(BookRepoContext))]
    [Migration("20240718191925_AddShareableUpdates")]
    partial class AddShareableUpdates
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.4")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("Server.Domain.Models.Book", b =>
                {
                    b.Property<string>("Isbn")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Authors")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("PageCount")
                        .HasColumnType("int");

                    b.Property<string>("Picture")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Release")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Subjects")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Isbn");

                    b.ToTable("Books");
                });

            modelBuilder.Entity("Server.Domain.Models.Bookshelf", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTimeOffset>("CreationDate")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("CustomerId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.Property<bool>("HomelessBooks")
                        .HasColumnType("bit");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTimeOffset>("UpdatedDate")
                        .HasColumnType("datetimeoffset");

                    b.HasKey("Id");

                    b.HasIndex("CustomerId");

                    b.ToTable("Bookshelves");
                });

            modelBuilder.Entity("Server.Domain.Models.BookshelfBook", b =>
                {
                    b.Property<Guid>("BookshelfId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("CustomerBookId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Isbn")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.Property<int>("Order")
                        .HasColumnType("int");

                    b.HasKey("BookshelfId", "CustomerBookId");

                    b.HasIndex("CustomerBookId");

                    b.HasIndex("Isbn");

                    b.ToTable("BookshelfBook");
                });

            modelBuilder.Entity("Server.Domain.Models.Customer", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("nvarchar(450)");

                    b.Property<DateTimeOffset>("CreationDate")
                        .HasColumnType("datetimeoffset");

                    b.HasKey("Id");

                    b.ToTable("Customer");
                });

            modelBuilder.Entity("Server.Domain.Models.CustomerBook", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("BookIsbn")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Comment")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("CustomerId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Isbn")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.Property<int>("Ranking")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("BookIsbn");

                    b.HasIndex("Isbn");

                    b.HasIndex("CustomerId", "Id")
                        .IsUnique();

                    b.ToTable("CustomerBooks");
                });

            modelBuilder.Entity("Server.Domain.Models.Shareable", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("CustomerId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.Property<Guid?>("ShowcaseId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("CustomerId");

                    b.HasIndex("ShowcaseId");

                    b.ToTable("Shareables");
                });

            modelBuilder.Entity("Server.Domain.Models.ShareableBookShowcase", b =>
                {
                    b.Property<Guid?>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("CustomerBookId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<bool>("ShowComment")
                        .HasColumnType("bit");

                    b.Property<bool>("ShowRanking")
                        .HasColumnType("bit");

                    b.HasKey("Id");

                    b.HasIndex("CustomerBookId");

                    b.ToTable("ShareableBookShowcase");
                });

            modelBuilder.Entity("Server.Domain.Models.ShareableBookshelf", b =>
                {
                    b.Property<Guid?>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("BookshelfId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<int>("Order")
                        .HasColumnType("int");

                    b.Property<Guid?>("ShareableId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("Id");

                    b.HasIndex("BookshelfId");

                    b.HasIndex("ShareableId");

                    b.ToTable("ShareableBookshelf");
                });

            modelBuilder.Entity("Server.Domain.Models.Bookshelf", b =>
                {
                    b.HasOne("Server.Domain.Models.Customer", null)
                        .WithMany("Bookshelves")
                        .HasForeignKey("CustomerId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Server.Domain.Models.BookshelfBook", b =>
                {
                    b.HasOne("Server.Domain.Models.Bookshelf", "Bookshelf")
                        .WithMany()
                        .HasForeignKey("BookshelfId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Server.Domain.Models.CustomerBook", "CustomerBook")
                        .WithMany()
                        .HasForeignKey("CustomerBookId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Bookshelf");

                    b.Navigation("CustomerBook");
                });

            modelBuilder.Entity("Server.Domain.Models.CustomerBook", b =>
                {
                    b.HasOne("Server.Domain.Models.Book", "Book")
                        .WithMany()
                        .HasForeignKey("BookIsbn")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Server.Domain.Models.Customer", "Customer")
                        .WithMany()
                        .HasForeignKey("CustomerId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Book");

                    b.Navigation("Customer");
                });

            modelBuilder.Entity("Server.Domain.Models.Shareable", b =>
                {
                    b.HasOne("Server.Domain.Models.Customer", "Customer")
                        .WithMany("Shareables")
                        .HasForeignKey("CustomerId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Server.Domain.Models.ShareableBookShowcase", "Showcase")
                        .WithMany()
                        .HasForeignKey("ShowcaseId");

                    b.Navigation("Customer");

                    b.Navigation("Showcase");
                });

            modelBuilder.Entity("Server.Domain.Models.ShareableBookShowcase", b =>
                {
                    b.HasOne("Server.Domain.Models.CustomerBook", "CustomerBook")
                        .WithMany()
                        .HasForeignKey("CustomerBookId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("CustomerBook");
                });

            modelBuilder.Entity("Server.Domain.Models.ShareableBookshelf", b =>
                {
                    b.HasOne("Server.Domain.Models.Bookshelf", "Bookshelf")
                        .WithMany()
                        .HasForeignKey("BookshelfId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Server.Domain.Models.Shareable", null)
                        .WithMany("Bookshelves")
                        .HasForeignKey("ShareableId");

                    b.Navigation("Bookshelf");
                });

            modelBuilder.Entity("Server.Domain.Models.Customer", b =>
                {
                    b.Navigation("Bookshelves");

                    b.Navigation("Shareables");
                });

            modelBuilder.Entity("Server.Domain.Models.Shareable", b =>
                {
                    b.Navigation("Bookshelves");
                });
#pragma warning restore 612, 618
        }
    }
}
