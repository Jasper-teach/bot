import { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, ComponentType, MessageFlags } from 'discord.js';
import { storage } from './storage';
import type { Product } from '@shared/schema';

class ExistenceBot {
  private client: Client;

  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ]
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.client.once('ready', () => {
      console.log(`Discord bot ready! Logged in as ${this.client.user?.tag}`);
      this.sendPermanentProductMenu();
      this.startAnimationLoop();
    });

    this.client.on('messageCreate', async (message) => {
      if (message.author.bot) return;

      console.log(`Received message: "${message.content}" from ${message.author.username}`);

      try {
        // Command: !products
        if (message.content.toLowerCase() === '!products') {
          console.log('Processing !products command');
          await this.sendProductsMenu(message);
        }

        // Command: !featured
        if (message.content.toLowerCase() === '!featured') {
          console.log('Processing !featured command');
          await this.sendFeaturedProducts(message);
        }

        // Command: !popular
        if (message.content.toLowerCase() === '!popular') {
          console.log('Processing !popular command');
          await this.sendPopularProducts(message);
        }

        // Command: !help
        if (message.content.toLowerCase() === '!help') {
          console.log('Processing !help command');
          await this.sendHelpMessage(message);
        }

        // Command: !status
        if (message.content.toLowerCase() === '!status') {
          console.log('Processing !status command');
          await this.sendProductStatus(message);
        }

        // Command: !news
        if (message.content.toLowerCase().startsWith('!news ')) {
          console.log('Processing !news command');
          await this.handleNewsCommand(message);
        }

        // Command: !announcement
        if (message.content.toLowerCase().startsWith('!announcement ')) {
          console.log('Processing !announcement command');
          await this.handleAnnouncementCommand(message);
        }

        // Command: !update
        if (message.content.toLowerCase().startsWith('!update ')) {
          console.log('Processing !update command');
          await this.handleUpdateCommand(message);
        }

        // Command: !welcome
        if (message.content.toLowerCase() === '!welcome') {
          console.log('Processing !welcome command');
          await this.handleWelcomeCommand(message);
        }
      } catch (error) {
        console.error('Error processing command:', error);
        await message.reply('Sorry, there was an error processing your command.');
      }
    });

    this.client.on('interactionCreate', async (interaction) => {
      if (interaction.isStringSelectMenu()) {
        if (interaction.customId === 'product_select' || interaction.customId === 'permanent_product_select') {
          const productId = parseInt(interaction.values[0]);
          const product = await storage.getProductById(productId);
          
          if (product) {
            await this.sendProductDetails(interaction, product);
          }
        }
      }

      if (interaction.isButton()) {
        if (interaction.customId.startsWith('download_')) {
          const productId = parseInt(interaction.customId.split('_')[1]);
          const product = await storage.getProductById(productId);
          
          if (product) {
            await this.handleDownload(interaction, product);
          }
        }
      }
    });
  }

  private async sendProductsMenu(message: any) {
    const products = await storage.getAllProducts();
    
    const embed = new EmbedBuilder()
      .setTitle('🔥 Existence Downloads')
      .setDescription('Select a product from the dropdown menu below to view download links for our available products.')
      .setColor(0x5865F2)
      .setTimestamp();

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('product_select')
      .setPlaceholder('Select a product')
      .addOptions(
        products.slice(0, 25).map(product => ({
          label: product.name,
          description: product.description.substring(0, 100),
          value: product.id.toString(),
          emoji: this.getCategoryEmoji(product.category)
        }))
      );

    const row = new ActionRowBuilder<StringSelectMenuBuilder>()
      .addComponents(selectMenu);

    await message.reply({
      embeds: [embed],
      components: [row]
    });
  }

  private async sendFeaturedProducts(message: any) {
    const products = await storage.getFeaturedProducts();
    
    const embed = new EmbedBuilder()
      .setTitle('⭐ Featured Products')
      .setDescription('Check out our hand-picked featured products')
      .setColor(0xF1C40F)
      .setTimestamp();

    for (const product of products.slice(0, 5)) {
      embed.addFields({
        name: `${this.getCategoryEmoji(product.category)} ${product.name}`,
        value: `${product.description}\n**Category:** ${product.category}`,
        inline: false
      });
    }

    await message.reply({ embeds: [embed] });
  }

  private async sendPopularProducts(message: any) {
    const products = await storage.getPopularProducts();
    
    const embed = new EmbedBuilder()
      .setTitle('🔥 Popular Products')
      .setDescription('Most downloaded products by our community')
      .setColor(0xE74C3C)
      .setTimestamp();

    for (const product of products.slice(0, 5)) {
      embed.addFields({
        name: `${this.getCategoryEmoji(product.category)} ${product.name}`,
        value: `${product.description}\n**Category:** ${product.category}`,
        inline: false
      });
    }

    await message.reply({ embeds: [embed] });
  }

  private async sendProductDetails(interaction: any, product: Product) {
    const embed = new EmbedBuilder()
      .setTitle(`${this.getCategoryEmoji(product.category)} ${product.name}`)
      .setDescription(product.description)
      .addFields(
        { name: 'Category', value: product.category, inline: true },
        { name: 'Status', value: product.featured ? '⭐ Featured' : product.popular ? '🔥 Popular' : '📦 Available', inline: true }
      )
      .setColor(this.getColorFromIndicator(product.colorIndicator))
      .setTimestamp();

    const downloadButton = new ButtonBuilder()
      .setCustomId(`download_${product.id}`)
      .setLabel(product.category === 'Loader' ? 'Access Loader' : 'Download')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('⬇️');

    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(downloadButton);

    await interaction.reply({
      embeds: [embed],
      components: [row],
      flags: MessageFlags.Ephemeral
    });
  }

  private async handleDownload(interaction: any, product: Product) {
    if (product.downloadUrl === "#") {
      const embed = new EmbedBuilder()
        .setTitle('⚠️ Download Not Available')
        .setDescription(`**${product.name}** download link is not configured yet.`)
        .setColor(0xFF0000)
        .setTimestamp();

      await interaction.reply({
        embeds: [embed],
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle('🔗 Download Link')
      .setDescription(`**${product.name}** is ready for download.`)
      .addFields(
        { name: 'Product', value: product.name, inline: true },
        { name: 'Category', value: product.category, inline: true },
        { name: 'Download', value: `[Click here to download](${product.downloadUrl})`, inline: false }
      )
      .setColor(0x00FF00)
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      flags: MessageFlags.Ephemeral
    });
  }

  private async sendHelpMessage(message: any) {
    const embed = new EmbedBuilder()
      .setTitle('🤖 Existence Bot Commands')
      .setDescription('Here are the available commands:')
      .addFields(
        { name: '!products', value: 'Browse all available products', inline: false },
        { name: '!featured', value: 'View featured products', inline: false },
        { name: '!popular', value: 'View popular products', inline: false },
        { name: '!status', value: 'View detailed product status and stats', inline: false },
        { name: '!news <title> | <content>', value: 'Post news announcement', inline: false },
        { name: '!announcement <title> | <content>', value: 'Post important announcement', inline: false },
        { name: '!update <product> | <content>', value: 'Post product update', inline: false },
        { name: '!welcome', value: 'Post welcome message to news channel', inline: false },
        { name: '!help', value: 'Show this help message', inline: false }
      )
      .setColor(0x5865F2)
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }

  private async sendProductStatus(message: any) {
    const products = await storage.getAllProducts();
    
    // Create main status embed
    const mainEmbed = new EmbedBuilder()
      .setTitle('📊 Existence Tool Status')
      .setDescription('Current status and stats for all available tools')
      .setColor(0x00FF00)
      .setTimestamp()
      .setFooter({ text: 'Last updated' });

    // Send main embed first
    await message.reply({ embeds: [mainEmbed] });

    // Send individual product status embeds
    for (const product of products) {
      const statusEmbed = new EmbedBuilder()
        .setTitle(`${this.getCategoryEmoji(product.category)} ${product.name}`)
        .setDescription(product.description)
        .addFields(
          { 
            name: 'Status', 
            value: product.downloadUrl !== "#" ? '🟢 SAFE TO USE' : '🟡 UPDATING', 
            inline: true 
          },
          { 
            name: 'Category', 
            value: product.category, 
            inline: true 
          },
          { 
            name: 'Availability', 
            value: product.downloadUrl !== "#" ? '✅ Available' : '⏳ Coming Soon', 
            inline: true 
          },
          { 
            name: 'Features', 
            value: this.getProductFeatures(product), 
            inline: false 
          },
          { 
            name: 'Risk Level', 
            value: product.downloadUrl !== "#" ? '🟢 LOW RISK SLIGHT BAN CHANCE' : '🟡 UPDATING', 
            inline: false 
          }
        )
        .setColor(this.getColorFromIndicator(product.colorIndicator))
        .setTimestamp();

      // Add download field if available
      if (product.downloadUrl !== "#") {
        statusEmbed.addFields({
          name: 'Download',
          value: `[Click here to download](${product.downloadUrl})`,
          inline: false
        });
      }

      await message.channel.send({ embeds: [statusEmbed] });
      
      // Small delay to prevent rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  private getProductFeatures(product: any): string {
    const features = [];
    
    if (product.category === 'External Tool') {
      features.push('🎯 Aimbot', '👁️ ESP/Wallhack', '🔍 No Recoil', '⚡ Speed Hack');
    } else if (product.category === 'Loader') {
      features.push('🚀 Fast Injection', '🛡️ Bypass Protection', '🔧 Easy Setup');
    } else if (product.category === 'Spoofer') {
      features.push('🔄 HWID Spoofing', '🛡️ Anti-Detection', '🔒 Secure Method');
    } else {
      features.push('⭐ Premium Features', '🔧 Advanced Tools', '💎 High Quality');
    }
    
    return features.join('\n');
  }

  private getAnimatedStatus(statusType: 'online' | 'updating'): string {
    const timestamp = Date.now();
    const pulseEffect = Math.floor(timestamp / 1000) % 2 === 0 ? '●' : '○';
    
    if (statusType === 'online') {
      return `🟢${pulseEffect} **SAFE TO USE**`;
    } else {
      return `🟡${pulseEffect} **UPDATING**`;
    }
  }

  private getAnimatedRiskLevel(riskType: 'low' | 'medium'): string {
    const riskIndicators = ['🟢', '🔵', '🟢'];
    const currentIndicator = riskIndicators[Math.floor(Date.now() / 2000) % riskIndicators.length];
    
    if (riskType === 'low') {
      return `${currentIndicator} **LOW RISK SLIGHT BAN CHANCE**`;
    } else {
      return `🟡 **MEDIUM RISK - UPDATING**`;
    }
  }

  private getCategoryEmoji(category: string): string {
    const emojiMap: { [key: string]: string } = {
      'Game Cheat': '🎮',
      'External Tool': '🔧',
      'Loader': '📦',
      'Spoofer': '🔒',
      'Utility': '⚙️'
    };
    return emojiMap[category] || '📄';
  }

  private getColorFromIndicator(color: string): number {
    const colorMap: { [key: string]: number } = {
      'red': 0xFF0000,
      'orange': 0xFF8C00,
      'purple': 0x800080,
      'blue': 0x0000FF,
      'green': 0x00FF00,
      'teal': 0x008080,
      'yellow': 0xFFFF00,
      'pink': 0xFFC0CB,
      'indigo': 0x4B0082
    };
    return colorMap[color] || 0x5865F2;
  }

  public async start() {
    try {
      await this.client.login(process.env.DISCORD_BOT_TOKEN);
    } catch (error) {
      console.error('Failed to start Discord bot:', error);
    }
  }

  private async sendPermanentProductMenu() {
    // Send dropdown menu to main channel
    const menuChannelId = process.env.DISCORD_CHANNEL_ID || "1366698054777962610";
    await this.sendDropdownMenu(menuChannelId);
    
    // Send status embed to status channel
    const statusChannelId = "1366051838797025351";
    await this.sendStatusEmbed(statusChannelId);
    
    // Send welcome message to news channel
    await this.sendWelcomeMessage();
  }

  private async sendDropdownMenu(channelId: string) {
    try {
      const channel = await this.client.channels.fetch(channelId);
      if (!channel || !('send' in channel) || !('messages' in channel)) {
        console.log('Channel not found or cannot send messages');
        return;
      }

      // Check if dropdown menu already exists
      const messages = await (channel as any).messages.fetch({ limit: 10 });
      const existingMenu = messages.find((msg: any) => 
        msg.author.id === this.client.user?.id && 
        msg.embeds[0]?.title?.includes('Existence Downloads') &&
        msg.components?.length > 0
      );

      if (existingMenu) {
        console.log('Dropdown menu already exists, skipping...');
        return;
      }

      const products = await storage.getAllProducts();
      
      const embed = new EmbedBuilder()
        .setTitle('🔥 Existence Downloads')
        .setDescription('Select a product from the dropdown menu below to view download links for our available products.')
        .setColor(0x5865F2)
        .setTimestamp()
        .setFooter({ text: 'Today at 00:24' });

      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('permanent_product_select')
        .setPlaceholder('Select a product')
        .addOptions(
          products.map((product) => ({
            label: product.name,
            description: product.description.substring(0, 100),
            value: product.id.toString(),
            emoji: this.getCategoryEmoji(product.category)
          }))
        );

      const row = new ActionRowBuilder<StringSelectMenuBuilder>()
        .addComponents(selectMenu);

      await (channel as any).send({
        embeds: [embed],
        components: [row]
      });

      console.log('Permanent product menu sent to channel');
    } catch (error) {
      console.error('Error sending permanent product menu:', error);
    }
  }

  private async sendStatusEmbed(channelId: string) {
    try {
      const channel = await this.client.channels.fetch(channelId);
      if (!channel || !('send' in channel) || !('messages' in channel)) {
        console.log('Status channel not found or cannot send messages');
        return;
      }

      // Check if status embed already exists
      const messages = await (channel as any).messages.fetch({ limit: 10 });
      const existingStatus = messages.find((msg: any) => 
        msg.author.id === this.client.user?.id && 
        msg.embeds[0]?.title?.includes('Existence Tool Status')
      );

      if (existingStatus) {
        console.log('Status embed already exists, skipping...');
        return;
      }

      const products = await storage.getAllProducts();
      
      const statusEmbed = new EmbedBuilder()
        .setTitle('📊 Existence Tool Status')
        .setDescription('Current status and information for all available tools')
        .setColor(0x00FF00)
        .setTimestamp()
        .setFooter({ text: 'Last updated' });

      // Add each product as a field
      for (const product of products) {
        const status = product.downloadUrl !== "#" ? this.getAnimatedStatus('online') : this.getAnimatedStatus('updating');
        const availability = product.downloadUrl !== "#" ? '✅ Available' : '⏳ Coming Soon';
        const riskLevel = product.downloadUrl !== "#" ? this.getAnimatedRiskLevel('low') : this.getAnimatedRiskLevel('medium');
        
        const fieldValue = [
          this.getEnhancedProductStatus(product),
          `**Category:** ${product.category}`,
          `**Availability:** ${availability}`,
          `**Risk Level:** ${riskLevel}`,
          `**Features:** ${this.getProductFeatures(product)}`
        ].join('\n');

        statusEmbed.addFields({
          name: `${this.getCategoryEmoji(product.category)} ${product.name}`,
          value: fieldValue,
          inline: false
        });
      }

      await (channel as any).send({
        embeds: [statusEmbed]
      });

      console.log('Status embed sent to channel');
    } catch (error) {
      console.error('Error sending status embed:', error);
    }
  }

  private startAnimationLoop() {
    // Update status embeds every 5 hours for animation effect
    setInterval(async () => {
      await this.updateStatusEmbed();
    }, 5 * 60 * 60 * 1000); // 5 hours in milliseconds
  }

  private async updateStatusEmbed() {
    const statusChannelId = "1366051838797025351";
    
    try {
      const channel = await this.client.channels.fetch(statusChannelId);
      if (!channel || !('messages' in channel)) return;

      // Fetch recent messages to find and update the status embed
      const messages = await (channel as any).messages.fetch({ limit: 10 });
      const statusMessage = messages.find((msg: any) => 
        msg.author.id === this.client.user?.id && 
        msg.embeds[0]?.title?.includes('Existence Tool Status')
      );

      if (statusMessage) {
        await this.sendStatusEmbed(statusChannelId);
        await statusMessage.delete();
      }
    } catch (error) {
      console.error('Error updating status embed:', error);
    }
  }

  private getAnimatedProgressBar(percentage: number): string {
    const filled = Math.floor(percentage / 10);
    const empty = 10 - filled;
    const bar = '█'.repeat(filled) + '░'.repeat(empty);
    return `[${bar}] ${percentage}%`;
  }

  private getEnhancedProductStatus(product: any): string {
    const isAvailable = product.downloadUrl !== "#";
    const statusIndicators = isAvailable ? 
      ['🟢●', '🟢○', '🔵●', '🟢●'] : 
      ['🟡●', '🟡○', '🟠●', '🟡●'];
    
    const currentStatus = statusIndicators[Math.floor(Date.now() / 3000) % statusIndicators.length];
    const uptime = isAvailable ? this.getAnimatedProgressBar(98) : this.getAnimatedProgressBar(45);
    
    return [
      `**Status:** ${currentStatus} ${isAvailable ? 'SAFE TO USE' : 'UPDATING'}`,
      `**Uptime:** ${uptime}`,
      `**Last Check:** <t:${Math.floor(Date.now() / 1000)}:R>`
    ].join('\n');
  }

  private async handleNewsCommand(message: any) {
    const content = message.content.slice(6); // Remove "!news "
    const parts = content.split(' | ');
    
    if (parts.length < 2) {
      await message.reply('Usage: `!news <title> | <content>`\nExample: `!news New Update Available | We just released version 2.0 with amazing features!`');
      return;
    }

    const title = parts[0].trim();
    const newsContent = parts[1].trim();

    await this.postToNewsChannel({
      type: 'news',
      title: `📰 ${title}`,
      content: newsContent,
      color: 0x3498DB,
      footer: 'Existence News'
    });

    await message.delete();
  }

  private async handleAnnouncementCommand(message: any) {
    const content = message.content.slice(14); // Remove "!announcement "
    const parts = content.split(' | ');
    
    if (parts.length < 2) {
      await message.reply('Usage: `!announcement <title> | <content>`\nExample: `!announcement Server Maintenance | Servers will be down for 2 hours tonight`');
      return;
    }

    const title = parts[0].trim();
    const announcementContent = parts[1].trim();

    await this.postToNewsChannel({
      type: 'announcement',
      title: `📢 ${title}`,
      content: announcementContent,
      color: 0xE74C3C,
      footer: 'Important Announcement'
    });

    await message.delete();
  }

  private async handleUpdateCommand(message: any) {
    const content = message.content.slice(8); // Remove "!update "
    const parts = content.split(' | ');
    
    if (parts.length < 2) {
      await message.reply('Usage: `!update <product> | <content>`\nExample: `!update Rust Arcane | Fixed detection issues and improved performance`');
      return;
    }

    const product = parts[0].trim();
    const updateContent = parts[1].trim();

    await this.postToNewsChannel({
      type: 'update',
      title: `🔄 ${product} Update`,
      content: updateContent,
      color: 0xF39C12,
      footer: 'Product Update'
    });

    await message.delete();
  }

  private async postToNewsChannel(newsData: {
    type: string;
    title: string;
    content: string;
    color: number;
    footer: string;
  }) {
    const newsChannelId = "1385298522085003388";
    
    try {
      const channel = await this.client.channels.fetch(newsChannelId);
      if (!channel || !('send' in channel)) {
        console.log('News channel not found or cannot send messages');
        return;
      }

      const embed = new EmbedBuilder()
        .setTitle(newsData.title)
        .setDescription(newsData.content)
        .setColor(newsData.color)
        .setTimestamp()
        .setFooter({ 
          text: newsData.footer,
          iconURL: this.client.user?.displayAvatarURL()
        });

      // Add special styling based on type
      if (newsData.type === 'announcement') {
        embed.addFields({
          name: '⚠️ Important',
          value: 'Please read this announcement carefully',
          inline: false
        });
      } else if (newsData.type === 'update') {
        embed.addFields({
          name: '📝 Version Info',
          value: `Updated: <t:${Math.floor(Date.now() / 1000)}:F>`,
          inline: true
        });
      }

      await (channel as any).send({
        embeds: [embed]
      });

      console.log(`Posted ${newsData.type} to news channel`);
    } catch (error) {
      console.error(`Error posting ${newsData.type} to news channel:`, error);
    }
  }

  private async handleWelcomeCommand(message: any) {
    await this.sendWelcomeMessage();
    await message.delete();
  }

  private async sendWelcomeMessage() {
    const newsChannelId = "1385298522085003388";
    
    try {
      const channel = await this.client.channels.fetch(newsChannelId);
      if (!channel || !('send' in channel) || !('messages' in channel)) {
        console.log('News channel not found or cannot send messages');
        return;
      }

      // Check if welcome message already exists
      const messages = await (channel as any).messages.fetch({ limit: 10 });
      const existingWelcome = messages.find((msg: any) => 
        msg.author.id === this.client.user?.id && 
        msg.embeds[0]?.title?.includes('Welcome to Existence')
      );

      if (existingWelcome) {
        console.log('Welcome message already exists, skipping...');
        return;
      }

      const welcomeEmbed = new EmbedBuilder()
        .setTitle('🎮 Welcome to Existence')
        .setDescription('Premium gaming tools and external solutions for competitive players')
        .addFields(
          {
            name: '🛠️ Our Tools',
            value: [
              '• **Rust Arcane External** - Advanced rust external with premium features',
              '• **BO6 Engine** - Call of Duty external for BO6 & Warzone',
              '• **NFA Account Loader** - Advanced gaming account management',
              '• **Rust Pro External** - Professional rust enhancement tools',
              '• **Spoofer** - Hardware ID spoofing for anticheat bypass'
            ].join('\n'),
            inline: false
          },
          {
            name: '📊 What We Offer',
            value: [
              '✅ **Undetected Tools** - Regular updates for latest game patches',
              '🔒 **Secure Downloads** - Safe and verified file hosting',
              '⚡ **Fast Support** - Quick response to issues and questions',
              '🎯 **Premium Features** - Aimbot, ESP, wallhacks, and more',
              '🛡️ **Anti-Detection** - Advanced bypass methods'
            ].join('\n'),
            inline: false
          },
          {
            name: '📢 Looking for Media Partners',
            value: [
              'We are actively seeking content creators and media partners!',
              '',
              '**What we need:**',
              '• Gaming content creators',
              '• Social media influencers',
              '• YouTube/Twitch streamers',
              '• Community managers',
              '',
              '**What we offer:**',
              '• Free access to all tools',
              '• Revenue sharing opportunities',
              '• Early access to new releases',
              '• Custom tool development'
            ].join('\n'),
            inline: false
          }
        )
        .setColor(0x9B59B6)
        .setTimestamp()
        .setFooter({ 
          text: 'Existence - Premium Gaming Solutions',
          iconURL: this.client.user?.displayAvatarURL() || null
        })
        .setThumbnail(this.client.user?.displayAvatarURL() || null);

      await (channel as any).send({
        embeds: [welcomeEmbed]
      });

      console.log('Posted welcome message to news channel');
    } catch (error) {
      console.error('Error posting welcome message to news channel:', error);
    }
  }

  public async stop() {
    this.client.destroy();
  }
}

export { ExistenceBot };