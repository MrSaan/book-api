import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { CreateBookDto } from "../dto/create-book.dto";
import { FilterBookDto } from "../dto/filter-book.dto";
import { Book } from "../entity/book.entity";

@Injectable()
export class BookRepository extends Repository<Book> {

    constructor(private dataSource: DataSource) {
        super(Book, dataSource.createEntityManager())
    }

    async getBooks(filter: FilterBookDto): Promise<Book[]> {
        const { title, author, category, min_year, max_year } = filter

        const query = this.createQueryBuilder('book')

        if (title) {
            query.andWhere('book.title LIKE :title', {
                title: `%${title.toLowerCase()}%`
            })
        }

        if (author) {
            query.andWhere('book.author LIKE :author', {
                author: `%${author.toLowerCase()}%`
            })
        }

        if (category) {
            query.andWhere('book.category LIKE :category', {
                category: `%${category.toLowerCase()}%`
            })
        }

        if (min_year) {
            query.andWhere('book.year >= :min_year', { min_year })
        }

        if (max_year) {
            query.andWhere('book.year <= :max_year', { max_year })
        }

        return await query.getMany()
    }

    async createBook(createBookDto: CreateBookDto): Promise<void> {
        const { title, author, category, year } = createBookDto

        const book = this.create()
        book.title = title
        book.author = author
        book.category = category
        book.year = year

        try {
            await book.save()
        } catch (e) {
            throw new InternalServerErrorException(e)
        }
    }

}