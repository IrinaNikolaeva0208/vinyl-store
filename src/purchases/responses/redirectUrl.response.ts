import { ApiProperty } from '@nestjs/swagger';

export class RedirectUrl {
  @ApiProperty({
    description: 'Url for payment',
    example:
      'https://checkout.stripe.com/c/pay/cs_live_a1RiISF54zdT3INMzYKn6v6u5Oq0y4tN3yZvOgbsVxvq6n63E3uPyuYjcT#fidkdWxOYHwnPyd1blppbHNgWjA0SkF1XzVEVDRyamNVf1w3UlVSc0JnTERjVDFvTzUxbVdVSEJnaGZBQVZ8TVJnRlRGTGNTdkBLbFFUXFZhSFYxYD1oUmhEcjVna3dOVjZKYGpAZjNzc0NHNTVGYWpLaHZ0dicpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl',
  })
  redirectUrl: string;
}
