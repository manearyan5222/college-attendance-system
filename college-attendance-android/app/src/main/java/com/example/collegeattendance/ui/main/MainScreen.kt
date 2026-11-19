package com.example.collegeattendance.ui.main

import android.annotation.SuppressLint
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.viewinterop.AndroidView
import androidx.navigation3.runtime.NavKey

@SuppressLint("SetJavaScriptEnabled")
@Composable
fun MainScreen(
  onItemClick: (NavKey) -> Unit,
  modifier: Modifier = Modifier,
) {
  AndroidView(
    factory = { context ->
      WebView(context).apply {
        webViewClient = WebViewClient()
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.allowFileAccess = true
        settings.allowContentAccess = true
        
        // Optimizations for WebView viewport on mobile screens
        settings.useWideViewPort = true
        settings.loadWithOverviewMode = true
        
        loadUrl("file:///android_asset/index.html")
      }
    },
    modifier = Modifier.fillMaxSize()
  )
}
