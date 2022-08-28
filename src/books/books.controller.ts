import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/get-user.decorator';
import { JwtGuard } from 'src/guard/jwt.guard';
import { UUIDValidationPipe } from 'src/pipes/uuid-validation.pipe';
import { User } from 'src/users/entity/user.entity';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { FilterBookDto } from './dto/filter-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entity/book.entity';

@Controller('books')
@UseGuards(JwtGuard)
export class BooksController {

    constructor(private bookService: BooksService) { }

    @Get()
    async getBooks(@Query() filter: FilterBookDto, @GetUser() user: User): Promise<Book[]> {
        console.log(user);

        return this.bookService.getBooks(filter);
    }

    @Get(':id')
    async getBookById(@Param('id', UUIDValidationPipe) id: string): Promise<Book> {
        return this.bookService.getBookById(id)
    }

    @Post()
    // validation pipe scope route / handler
    // @UsePipes(ValidationPipe)
    async createBook(
        @Body() payload: CreateBookDto): Promise<void> {
        return this.bookService.createBook(payload)
    }

    @Put(':id')
    // validation pipe scope route
    // @UsePipes(ValidationPipe)
    async updateBook(
        @Param('id', UUIDValidationPipe) id: string,
        @Body() payload: UpdateBookDto): Promise<void> {
        return this.bookService.updateBook(id, payload)
    }

    @Delete(':id')
    deletedBook(
        @Param('id', UUIDValidationPipe) id: string
    ): Promise<void> {
        return this.bookService.deletedBook(id)
    }
}
