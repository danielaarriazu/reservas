package com.example.reservas.security;

import java.io.IOException;
import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    //@Autowired
    //private UserDetailsService userDetailsService;



    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        String path = request.getServletPath();

        if (request.getMethod().equals("OPTIONS")) {
            chain.doFilter(request, response);
            return;
        }
        if (path.startsWith("/auth") || 
            path.startsWith("/h2-console") || 
            path.equals("/") ||
            path.startsWith("/swagger-ui") ||
            path.startsWith("/v3/api-docs")) {
            chain.doFilter(request, response);
            return;
        }

        // Permitir /reservas/datos sin autenticación (para Python API)
        if (path.equals("/reservas/datos") && request.getMethod().equals("GET")) {
            chain.doFilter(request, response);
            return;
        }

        final String header = request.getHeader("Authorization");
        String jwt = null;
        String email = null;
        String rol = null;

        if (header != null && header.startsWith("Bearer ")) {
            jwt = header.substring(7);
            try {
                email = jwtUtil.extractUsername(jwt);
                rol = jwtUtil.extractRol(jwt);  // 🔥 CRÍTICO: Extraer el ROL del token
                System.out.println("🔹 JWT extraído - Email: " + email + " | Rol: " + rol);
            } catch (Exception e) {
                System.err.println("❌ Error al procesar JWT: " + e.getMessage());
            }
        }

        if (email != null && rol != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // 🔥 CRÍTICO: Crear UserDetails con el ROL correcto
            UserDetails userDetails = User.builder()
                    .username(email)
                    .password("")  // No necesitamos la contraseña aquí
                    .authorities(Collections.singletonList(new SimpleGrantedAuthority(rol)))
                    .build();

            if (jwtUtil.validateToken(jwt, userDetails)) {
                var authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
                
                System.out.println("✅ Usuario autenticado: " + email + " con rol: " + rol);
            }
        }

        chain.doFilter(request, response);
    }
}