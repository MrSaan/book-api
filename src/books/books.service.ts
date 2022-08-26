import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateBookDto } from './dto/create-book.dto';
import { FilterBookDto } from './dto/filter-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entity/book.entity';
import { BookRepository } from './repository/book.repository';

@Injectable()
export class BooksService {

    constructor(private bookRepository: BookRepository) { }

    async getBooks(filter: FilterBookDto): Promise<Book[]> {
        return await this.bookRepository.getBooks(filter)
    }

    async createBook(createBookDto: CreateBookDto): Promise<void> {
        return await this.bookRepository.createBook(createBookDto)
    }

    async getBookById(id: string): Promise<Book> {
        const book = await this.bookRepository.findOneBy({ id: id })

        if (!book) {
            throw new NotFoundException(`Book with id ${id} is not found`)
        }

        return book
    }

    async updateBook(id: string, updateBookDto): Promise<void> {
        const { title, author, category, year } = updateBookDto

        const book = await this.getBookById(id)
        book.title = title
        book.author = author
        book.category = category
        book.year = year
        await book.save()
    }

    async deletedBook(id: string): Promise<void> {
        const result = await this.bookRepository.delete(id)

        if (result.affected == 0) {
            throw new NotFoundException(`Book with id ${id} is not found`)
        }
    }

    // updateBook(id: string, updateBookDto: UpdateBookDto) {
    //     const { title, author, category, year } = updateBookDto
    //     this.bookIdx = this.findBookById(id)

    //     // index array menjadi parameter untuk update
    //     this.books[this.bookIdx].title = title
    //     this.books[this.bookIdx].author = author
    //     this.books[this.bookIdx].category = category
    //     this.books[this.bookIdx].year = year

    // }

    // findBookById(id: string) {
    //     this.bookId = this.books.findIndex((book) => book.id == id)
    //     if (this.bookId === -1) {
    //         throw new NotFoundException(`Book with id ${id} is not found`)
    //     }

    //     //success => mengembalikan index array
    //     return this.bookId
    // }

    // deleteBook(id: string) {
    //     this.bookIdx = this.findBookById(id)
    //     this.books.splice(this.bookIdx, 1)
    // }
}
