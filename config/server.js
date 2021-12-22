module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 6540),
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', 'd31efcf17b1771067f8fd7203515d6b7'),
    },
  },
});
